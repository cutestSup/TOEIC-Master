"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function ScoreChart() {
    const results = useStore(state => state.results);
    const goal = useStore(state => state.goal);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const data = useMemo(() => {
        return results.map(r => ({
            name: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            Listening: r.listeningScore,
            Reading: r.readingScore,
            Total: r.totalScore
        }));
    }, [results]);

    const averageScore = useMemo(() => {
        if (results.length === 0) return 0;
        return Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length);
    }, [results]);

    if (!mounted) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[350px] w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Score Progression</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Track your improvement over time</p>
                    </div>
                    {averageScore > 0 && (
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <TrendingUp className="h-4 w-4" />
                                <span>Avg: {averageScore}</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorListening" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                            <XAxis 
                                dataKey="name" 
                                stroke="hsl(var(--muted-foreground))"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                                domain={[0, 990]} 
                                stroke="hsl(var(--muted-foreground))"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Area 
                                type="monotone" 
                                dataKey="Total" 
                                stroke="hsl(var(--primary))" 
                                fillOpacity={1} 
                                fill="url(#colorTotal)" 
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="Listening" 
                                stroke="#82ca9d" 
                                fillOpacity={1} 
                                fill="url(#colorListening)"
                                strokeWidth={2}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="Reading" 
                                stroke="#ffc658" 
                                fillOpacity={1} 
                                fill="url(#colorReading)"
                                strokeWidth={2}
                            />
                            {goal > 0 && (
                                <Line 
                                    type="monotone" 
                                    dataKey={() => goal} 
                                    stroke="#ef4444" 
                                    strokeDasharray="5 5" 
                                    strokeWidth={2}
                                    dot={false}
                                    legendType="none"
                                    name="Goal"
                                />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
