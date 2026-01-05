"use client"

import { useState, useEffect, useCallback } from 'react';

export function useTextToSpeech() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);

            const updateVoices = () => {
                setVoices(window.speechSynthesis.getVoices());
            };

            // Chrome loads voices asynchronously
            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!isSupported) return;

        window.speechSynthesis.cancel(); // Stop any current speech
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';

        // Attempt to find a better voice (Google US English or Microsoft Zira)
        const preferredVoice = voices.find(v =>
            v.name.includes("Google US English") ||
            v.name.includes("Zira") ||
            (v.lang === 'en-US' && v.localService)
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isSupported, voices]);

    const cancel = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [isSupported]);

    return { speak, cancel, isSpeaking, isSupported };
}
