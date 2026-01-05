"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { useMemo, useState, useEffect } from "react";

export default function ScoreChart() {
    const results = useStore(state => state.results);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const data = useMemo(() => {
        return results.map(r => ({
            name: new Date(r.date).toLocaleDateString(),
            Listening: r.listeningScore,
            Reading: r.readingScore,
            Total: r.totalScore
        }));
    }, [results]);

    if (!mounted) return null;

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Score Progression</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 990]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Total" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                            <Line type="monotone" dataKey="Listening" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="Reading" stroke="#ffc658" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
