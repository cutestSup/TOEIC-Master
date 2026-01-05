import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserState, Task, TestResult, BugLog, TaskPhase, Deck, VocabCard, CardStatus } from '@/types';
import vocabData from '@/data/vocab-data.json';

type RawVocabWord = {
    id: string;
    term: string;
    type: string;
    meaning: string;
    pronunciation?: string;
    example?: string;
    audio?: string;
    image?: string;
};

type RawVocabLesson = {
    id: string;
    name: string;
    image?: string;
    words: RawVocabWord[];
};

const normalizeType = (type?: string) => (type ?? '').replace(/[()]/g, '').trim();

const normalizeImage = (path?: string) => {
    if (!path) return undefined;
    // Strip potential leading "assets" to match public folder structure
    return path.replace(/^assets\//, '/');
};

const buildDecksFromVocab = (lessons: RawVocabLesson[]): Deck[] => {
    return lessons.map((lesson) => ({
        id: lesson.id,
        name: lesson.name,
        image: normalizeImage(lesson.image),
        cards: (lesson.words || []).map((w) => ({
            id: w.id,
            term: w.term,
            definition: w.meaning,
            type: normalizeType(w.type),
            example: w.example || '',
            status: 'new',
            pronunciation: w.pronunciation,
            audio: w.audio,
            image: w.image,
        })),
    }));
};

interface StoreActions {
    setGoal: (goal: number) => void;
    setExamDate: (date: string) => void;

    addTask: (title: string, phase: TaskPhase) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;

    addResult: (result: Omit<TestResult, 'id' | 'totalScore'>) => void;
    deleteResult: (id: string) => void;

    addBug: (bug: Omit<BugLog, 'id' | 'reviewed'>) => void;
    toggleBugReview: (id: string) => void;
    deleteBug: (id: string) => void;

    addDeck: (name: string) => void;
    deleteDeck: (id: string) => void;
    addCardToDeck: (deckId: string, card: Omit<VocabCard, 'id' | 'status'>) => void;
    updateCardStatus: (deckId: string, cardId: string, status: CardStatus) => void;
    importDeck: (name: string, cards: Omit<VocabCard, 'id' | 'status'>[]) => void;

    resetStore: () => void;
}

type Store = UserState & StoreActions;

const INITIAL_STATE: UserState = {
    goal: 800,
    examDate: null,
    tasks: [
        { id: '1', title: 'Memorize 20 TOEIC words', completed: false, phase: 'Database' },
        { id: '2', title: 'Read 1 Grammar article', completed: false, phase: 'Database' },
        { id: '3', title: 'Complete Part 5 practice', completed: false, phase: 'Skills' },
    ],
    results: [
        { id: '1', date: new Date().toISOString(), testName: 'Diagnostic Test', listeningScore: 300, readingScore: 250, totalScore: 550 } // Example data
    ],
    bugs: [],
    decks: buildDecksFromVocab(vocabData as RawVocabLesson[])
};

export const useStore = create<Store>()(
    persist(
        (set) => ({
            ...INITIAL_STATE,

            setGoal: (goal) => set({ goal }),
            setExamDate: (examDate) => set({ examDate }),

            addTask: (title, phase) => set((state) => ({
                tasks: [...state.tasks, {
                    id: crypto.randomUUID(),
                    title,
                    completed: false,
                    phase
                }]
            })),

            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                )
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id)
            })),

            addResult: (result) => set((state) => ({
                results: [...state.results, {
                    ...result,
                    id: crypto.randomUUID(),
                    totalScore: result.listeningScore + result.readingScore
                }]
            })),

            deleteResult: (id) => set((state) => ({
                results: state.results.filter((r) => r.id !== id)
            })),

            addBug: (bug) => set((state) => ({
                bugs: [...state.bugs, {
                    ...bug,
                    id: crypto.randomUUID(),
                    reviewed: false
                }]
            })),

            toggleBugReview: (id) => set((state) => ({
                bugs: state.bugs.map((b) =>
                    b.id === id ? { ...b, reviewed: !b.reviewed } : b
                )
            })),

            deleteBug: (id) => set((state) => ({
                bugs: state.bugs.filter((b) => b.id !== id)
            })),

            addDeck: (name) => set((state) => ({
                decks: [...state.decks, { id: crypto.randomUUID(), name, cards: [] }]
            })),

            deleteDeck: (id) => set((state) => ({
                decks: state.decks.filter(d => d.id !== id)
            })),

            addCardToDeck: (deckId, card) => set((state) => ({
                decks: state.decks.map(d => d.id === deckId ? {
                    ...d,
                    cards: [...d.cards, { ...card, id: crypto.randomUUID(), status: 'new' }]
                } : d)
            })),

            updateCardStatus: (deckId, cardId, status) => set((state) => ({
                decks: state.decks.map(d => d.id === deckId ? {
                    ...d,
                    cards: d.cards.map(c => c.id === cardId ? { ...c, status, lastReviewed: new Date().toISOString() } : c)
                } : d)
            })),

            importDeck: (name, cards) => set((state) => ({
                decks: [...state.decks, {
                    id: crypto.randomUUID(),
                    name,
                    cards: cards.map(c => ({ ...c, id: crypto.randomUUID(), status: 'new' }))
                }]
            })),

            resetStore: () => set(INITIAL_STATE),
        }),
        {
            name: 'toeic-master-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
