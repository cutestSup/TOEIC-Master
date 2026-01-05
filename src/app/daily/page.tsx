"use client"

import { useState, useEffect } from 'react';
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskPhase } from '@/types';

export default function DailySprint() {
    const { tasks, addTask, toggleTask, deleteTask } = useStore();
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTask(newTaskTitle, 'Skills'); // Defaulting to Skills for now
        setNewTaskTitle("");
    };

    if (!mounted) return null;

    const phases: TaskPhase[] = ['Database', 'Skills', 'Deploy'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Daily Sprint</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-muted-foreground">Streak:</span>
                    <span className="text-xl font-bold text-orange-500">🔥 3</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTask} className="flex space-x-2">
                        <Input
                            placeholder="e.g., Do Part 7 Test 3"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                {phases.map(phase => (
                    <Card key={phase} className="h-full">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{phase} Phase</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tasks.filter(t => t.phase === phase).map(task => (
                                <div key={task.id} className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleTask(task.id)}>
                                        {task.completed ?
                                            <CheckCircle2 className="h-5 w-5 text-green-500" /> :
                                            <Circle className="h-5 w-5 text-slate-300" />
                                        }
                                        <span className={cn("text-sm transition-all", task.completed && "text-muted-foreground line-through")}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-red-500 hover:text-red-600"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {tasks.filter(t => t.phase === phase).length === 0 && (
                                <div className="text-sm text-muted-foreground italic text-center py-4">
                                    No tasks for this phase
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
