"use client"

import { useState, useMemo, use, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import Flashcard from "@/components/vocab/Flashcard";
import { notFound } from "next/navigation";

export default function StudyDeck({ params }: { params: Promise<{ id: string }> }) {
    const { decks, updateCardStatus } = useStore();
    const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
    const [deckId, setDeckId] = useState<string | null>(null);

    // Unwrapping params reliably for Client Component
    useEffect(() => {
        params.then(p => {
            setResolvedParams(p);
            setDeckId(p.id);
        });
    }, [params]);

    const deck = useMemo(() => {
        if (!deckId) return null;
        return decks.find(d => d.id === deckId);
    }, [decks, deckId]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Filter cards that are NOT mastered (for study session)
    // Or just show all? Prompt says "Move to Mastered list". 
    // Let's filter to show only 'new' and 'learning' cards for the session queue.
    const studyQueue = useMemo(() => {
        if (!deck) return [];
        return deck.cards.filter(c => c.status !== 'mastered');
    }, [deck]);

    if (!deckId) return null; // Loading state
    if (resolvedParams && !deck) return notFound();

    const handleStatusChange = (status: 'learning' | 'mastered') => {
        if (!deck) return;
        const currentCard = studyQueue[currentIndex];
        if (!currentCard) return;

        updateCardStatus(deck.id, currentCard.id, status);

        // Logic check:
        // If 'mastered', card is removed from studyQueue (via useMemo filter).
        // If 'learning', card stays.
        // We need to wait for re-render to see new queue length, but we can predict behavior.

        if (status === 'mastered') {
            // Card removed. Current index is now the NEXT card. 
            // So we generally keep index SAME.
            // But we must assume the queue length will decrease by 1 immediately in next render.
            // If we are at the last item (index 0, length 1 -> length 0), we are done.
            const predictedLength = studyQueue.length - 1;
            if (currentIndex >= predictedLength && predictedLength > 0) {
                // If we were at end, move back or stay?
                // If [A, B] (idx 1). B removed. [A] (len 1). Idx 1 > 0.
                // We should set index to 0 (since A is now the only one, but we might have already studied it? No, order preserved).
                // Actually, if we master B, we are done with B. We want to see next card? 
                // If there is no next card, we are done?
                // Simple approach: Clamping index to new length - 1, or complete.
                if (predictedLength === 0) {
                    setIsComplete(true);
                } else {
                    setCurrentIndex(prev => Math.min(prev, predictedLength - 1));
                }
            } else if (predictedLength <= 0) {
                setIsComplete(true);
            }
            // else: index stays same, pointing to next card that slots in
        } else {
            // Card NOT removed. Move to next.
            if (currentIndex < studyQueue.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setIsComplete(true);
            }
        }
    };

    const currentCard = studyQueue[currentIndex];
    const canGoBack = currentIndex > 0;

    const handlePrev = () => {
        if (!canGoBack) return;
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    // Safety check for crash prevention
    if (!currentCard && studyQueue.length > 0) {
        // Correct index if out of bounds (fallback)
        setCurrentIndex(0);
        return null;
    } else if (!currentCard && studyQueue.length === 0) {
        // Should be caught by earlier empty check, but safety
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
                <h1 className="text-3xl font-bold">All Mastered! 🎉</h1>
                <Link href="/vocab">
                    <Button>Back to Decks</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <Link href="/vocab">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">{deck?.name}</h1>
                    <p className="text-sm text-muted-foreground">Card {currentIndex + 1} of {studyQueue.length}</p>
                </div>
            </div>

            <Flashcard
                card={currentCard}
                onStatusChange={handleStatusChange}
                onPrev={handlePrev}
                canGoBack={canGoBack}
                key={currentCard.id} // Key ensures component resets on card change
            />
        </div>
    );
}
