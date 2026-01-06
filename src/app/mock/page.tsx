"use client"

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MockTest() {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(7200); 
    const [mode, setMode] = useState<'Full' | 'Listening' | 'Reading'>('Full');

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const setTimerMode = (newMode: 'Full' | 'Listening' | 'Reading') => {
        setMode(newMode);
        setIsActive(false);
        switch (newMode) {
            case 'Full': setTimeLeft(7200); break; // 120m
            case 'Listening': setTimeLeft(2700); break; // 45m
            case 'Reading': setTimeLeft(4500); break; // 75m
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Mock Test Simulation</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Timer Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Exam Timer</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-6">
                        <div className="flex space-x-2">
                            {(['Full', 'Listening', 'Reading'] as const).map((m) => (
                                <Button
                                    key={m}
                                    variant={mode === m ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTimerMode(m)}
                                >
                                    {m}
                                </Button>
                            ))}
                        </div>

                        <div className={cn("text-6xl font-mono font-bold tracking-widest", timeLeft < 300 && "text-red-500 animate-pulse")}>
                            {formatTime(timeLeft)}
                        </div>

                        <div className="flex space-x-4 w-full">
                            <Button
                                className="flex-1"
                                variant={isActive ? "secondary" : "default"}
                                onClick={() => setIsActive(!isActive)}
                            >
                                {isActive ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Start</>}
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => setTimerMode(mode)}>
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Answer Sheet Placeholder */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Rapid Answer Sheet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
                            <div className="text-center space-y-2">
                                <p className="text-muted-foreground">Digital Bubble Sheet feature coming soon.</p>
                                <Button variant="outline"><Save className="mr-2 h-4 w-4" /> Save Results Manually</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
