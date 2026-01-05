"use client"

import { useState, useEffect } from 'react';
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BugLog, ErrorType } from '@/types';
import { CheckCircle, XCircle, Plus, Trash2, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BugTracker() {
    const { bugs, addBug, toggleBugReview, deleteBug } = useStore();
    const [mounted, setMounted] = useState(false);

    // Form State
    const [testId, setTestId] = useState("");
    const [part, setPart] = useState("5");
    const [questionNum, setQuestionNum] = useState("");
    const [errorType, setErrorType] = useState<ErrorType>("Grammar");
    const [rootCause, setRootCause] = useState("");
    const [fix, setFix] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addBug({
            testId,
            part: parseInt(part),
            questionNum: parseInt(questionNum),
            errorType,
            rootCause,
            fix
        });
        // Reset basic fields
        setQuestionNum("");
        setRootCause("");
        setFix("");
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Bug Tracker</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Input Form */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Bug className="h-5 w-5" />
                            <span>Log New Bug</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Test ID</label>
                                    <Input value={testId} onChange={e => setTestId(e.target.value)} placeholder="ETS 2022-1" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Part</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={part}
                                        onChange={e => setPart(e.target.value)}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>Part {n}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Q#</label>
                                    <Input type="number" value={questionNum} onChange={e => setQuestionNum(e.target.value)} placeholder="101" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Error Type</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={errorType}
                                        onChange={e => setErrorType(e.target.value as ErrorType)}
                                    >
                                        {['Vocab', 'Grammar', 'Trap/Trick', 'Speed', 'Pronunciation', 'Other'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium">Root Cause</label>
                                <Input value={rootCause} onChange={e => setRootCause(e.target.value)} placeholder="Why did you miss it?" required />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium">Fix/Solution</label>
                                <Input value={fix} onChange={e => setFix(e.target.value)} placeholder="How to prevent next time?" required />
                            </div>

                            <Button type="submit" className="w-full">Log Bug</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Bug List */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Bugs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">Loc</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Issue</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {bugs.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-muted-foreground">No bugs logged yet. Good job?</td>
                                        </tr>
                                    )}
                                    {bugs.map(bug => (
                                        <tr key={bug.id} className={cn("border-b transition-colors hover:bg-muted/50", bug.reviewed && "bg-muted/30 opacity-60")}>
                                            <td className="p-4 align-middle font-medium">
                                                {bug.testId} <br />
                                                <span className="text-xs text-muted-foreground">P{bug.part} Q{bug.questionNum}</span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="font-medium">{bug.rootCause}</div>
                                                <div className="text-xs text-muted-foreground">{bug.fix}</div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    {bug.errorType}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="ghost" size="icon" onClick={() => toggleBugReview(bug.id)}>
                                                        {bug.reviewed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => deleteBug(bug.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
