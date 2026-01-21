"use client"

import { useState, useEffect } from 'react';
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskPhase } from '@/types';
import { motion } from "framer-motion";

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
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Daily Sprint</h1>
                    <p className="text-muted-foreground mt-2">Track your daily tasks and build momentum</p>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-lg">
                    <span className="text-sm font-medium text-white">Streak:</span>
                    <span className="text-xl font-bold text-white">🔥 3</span>
                </div>
            </motion.div>

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
                {phases.map((phase, phaseIndex) => {
                    const phaseTasks = tasks.filter(t => t.phase === phase);
                    const completedCount = phaseTasks.filter(t => t.completed).length;
                    const totalCount = phaseTasks.length;
                    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
                    
                    return (
                        <motion.div
                            key={phase}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: phaseIndex * 0.1 }}
                        >
                            <Card className="h-full border-2 hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-bold">{phase} Phase</CardTitle>
                                        {totalCount > 0 && (
                                            <span className="text-xs text-muted-foreground">
                                                {completedCount}/{totalCount}
                                            </span>
                                        )}
                                    </div>
                                    {totalCount > 0 && (
                                        <div className="mt-3 w-full bg-muted rounded-full h-2">
                                            <motion.div
                                                className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.8, delay: phaseIndex * 0.1 + 0.3 }}
                                            />
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {phaseTasks.map((task, taskIndex) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: taskIndex * 0.05 }}
                                            className="flex items-center justify-between group"
                                        >
                                            <div 
                                                className="flex items-center space-x-3 cursor-pointer flex-1" 
                                                onClick={() => toggleTask(task.id)}
                                            >
                                                {task.completed ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-slate-300 hover:text-primary transition-colors flex-shrink-0" />
                                                )}
                                                <span className={cn(
                                                    "text-sm transition-all flex-1",
                                                    task.completed && "text-muted-foreground line-through"
                                                )}>
                                                    {task.title}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 h-8 w-8 text-red-500 hover:text-red-600 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteTask(task.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                    {phaseTasks.length === 0 && (
                                        <div className="text-sm text-muted-foreground italic text-center py-8 bg-muted/30 rounded-lg">
                                            No tasks for this phase
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
