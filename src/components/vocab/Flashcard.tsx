"use client"

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { VocabCard } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";

interface FlashcardProps {
    card: VocabCard;
    onStatusChange: (status: 'learning' | 'mastered') => void;
    onPrev: () => void;
    canGoBack: boolean;
}


export default function Flashcard({ card, onStatusChange, onPrev, canGoBack }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const { speak, cancel, isSpeaking } = useTextToSpeech();
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [exitX, setExitX] = useState(0);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Stop any ongoing TTS
        cancel();

        // Stop previous audio element
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        if (card.audio) {
            const audio = new Audio(`/audio/words/${card.audio}.mp3`);
            audioRef.current = audio;
            setIsAudioPlaying(true);

            audio.onended = () => setIsAudioPlaying(false);
            audio.onerror = () => {
                setIsAudioPlaying(false);
                speak(card.term);
            };

            audio.play().catch(() => {
                setIsAudioPlaying(false);
                speak(card.term);
            });
            return;
        }

        // Fallback to TTS when no audio file is provided
        speak(card.term);
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleDragEnd = (_: any, info: any) => {
        const threshold = 100;
        
        if (info.offset.x > threshold) {
            // Swipe right = Mastered
            setExitX(1000);
            setTimeout(() => {
                onStatusChange('mastered');
                setExitX(0);
                setIsFlipped(false);
            }, 300);
        } else if (info.offset.x < -threshold) {
            // Swipe left = Learning (next word)
            setExitX(-1000);
            setTimeout(() => {
                onStatusChange('learning');
                setExitX(0);
                setIsFlipped(false);
            }, 300);
        }
    };

    return (
        <div className="flex flex-col items-center relative">
            {/* Swipe Hints */}
            {isFlipped && (
                <>
                    <motion.div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-red-500/20 rounded-r-lg px-4 py-2 pointer-events-none"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 0.7, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">← Review</span>
                    </motion.div>
                    <motion.div 
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-500/20 rounded-l-lg px-4 py-2 pointer-events-none"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0.7, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Mastered →</span>
                    </motion.div>
                </>
            )}

            <motion.div
                className="relative w-full max-w-md h-64 perspective-1000 cursor-grab active:cursor-grabbing"
                drag={isFlipped ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                animate={{ x: exitX }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={!isFlipped ? handleFlip : undefined}
                style={{ touchAction: 'none' }}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <Card className="absolute w-full h-full backface-hidden inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <CardContent className="space-y-4">
                            <h2 className="text-4xl font-bold">{card.term}</h2>
                            <div className="flex items-center space-x-3 text-muted-foreground justify-center">
                                <div className="flex items-center space-x-2">
                                    <span>/{card.type}/</span>
                                    {card.pronunciation && (
                                        <span className="text-sm text-muted-foreground">{card.pronunciation}</span>
                                    )}
                                </div>
                                <Volume2
                                    className={`w-6 h-6 cursor-pointer hover:text-primary transition-colors ${
                                        isSpeaking || isAudioPlaying ? 'text-primary animate-pulse' : ''
                                    }`}
                                    onClick={playAudio}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">(Click to Flip)</p>
                        </CardContent>
                    </Card>

                    {/* Back */}
                    <Card
                        className="absolute w-full h-full backface-hidden inset-0 flex flex-col items-center justify-center p-6 text-center"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <CardContent className="space-y-4 text-center w-full">
                            {card.image && (
                                <div className="relative w-32 h-32 mx-auto">
                                    <Image
                                        src={card.image.replace(/^assets\//, '/')}
                                        alt={card.term}
                                        fill
                                        className="object-cover rounded"
                                        sizes="144px"
                                    />
                                </div>
                            )}
                            <div className="text-2xl font-bold text-primary">{card.definition}</div>
                            {card.example && <div className="italic text-lg">"{card.example}"</div>}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Controls - Now secondary option */}
            {isFlipped && (
                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                    <p className="text-xs text-muted-foreground w-full text-center mb-2">
                        Swipe left to review, right to master • Or use buttons below
                    </p>
                    <button
                        onClick={() => {
                            setIsFlipped(false);
                            onPrev();
                        }}
                        disabled={!canGoBack}
                        className={`px-6 py-3 rounded-full font-bold shadow-lg transition-transform ${
                            canGoBack
                                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 hover:scale-105'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Previous Word
                    </button>
                    <button
                        onClick={() => {
                            setIsFlipped(false);
                            onStatusChange('learning');
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                    >
                        Next Word
                    </button>
                    <button
                        onClick={() => {
                            setIsFlipped(false);
                            onStatusChange('mastered');
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                    >
                        I Know This
                    </button>
                </div>
            )}
        </div>
    );
}
