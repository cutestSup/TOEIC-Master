export type TaskPhase = 'Database' | 'Skills' | 'Deploy';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    phase: TaskPhase;
}

export interface TestResult {
    id: string;
    date: string; // ISO Date string
    testName: string;
    listeningScore: number;
    readingScore: number;
    totalScore: number;
}

export type ErrorType = 'Vocab' | 'Grammar' | 'Trap/Trick' | 'Speed' | 'Pronunciation' | 'Other';

export interface BugLog {
    id: string;
    testId: string;
    part: number; // 1-7
    questionNum: number;
    errorType: ErrorType;
    rootCause: string;
    fix: string;
    reviewed: boolean;
}

export type CardStatus = 'new' | 'learning' | 'mastered';

export interface VocabCard {
    id: string;
    term: string;
    definition: string;
    type: string; // n, v, adj
    example: string;
    status: CardStatus;
    pronunciation?: string;
    audio?: string;
    image?: string;
    lastReviewed?: string; // ISO Date
}

export interface Deck {
    id: string;
    name: string;
    image?: string;
    cards: VocabCard[];
}

export interface UserState {
    goal: number;
    examDate: string | null;
    tasks: Task[];
    results: TestResult[];
    bugs: BugLog[];
    decks: Deck[];
}
