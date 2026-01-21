"use client"

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, FileText, Target, ChevronRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type LessonCategory = 'listening' | 'reading' | 'grammar' | 'strategy';

interface Lesson {
    id: string;
    title: string;
    category: LessonCategory;
    part?: number;
    duration: string;
    description: string;
    topics: string[];
    completed?: boolean;
}

const LESSONS: Lesson[] = [
    // Listening Lessons
    {
        id: 'l1',
        title: 'Part 1: Photographs - Person & Object Description',
        category: 'listening',
        part: 1,
        duration: '15 min',
        description: 'Master describing people, objects, and actions in photographs',
        topics: ['Present continuous vs Simple present', 'Passive voice', 'Prepositions of place', 'Common distractors']
    },
    {
        id: 'l2',
        title: 'Part 2: Question-Response Patterns',
        category: 'listening',
        part: 2,
        duration: '20 min',
        description: 'Learn to identify question types and predict correct responses',
        topics: ['Wh-questions', 'Yes/No questions', 'Indirect responses', 'Negative questions']
    },
    {
        id: 'l3',
        title: 'Part 3: Conversations - Main Idea & Details',
        category: 'listening',
        part: 3,
        duration: '25 min',
        description: 'Practice identifying speakers, topics, and specific information',
        topics: ['Setting identification', 'Speaker roles', 'Problem-solution', 'Next action questions']
    },
    {
        id: 'l4',
        title: 'Part 4: Short Talks - Announcements & Messages',
        category: 'listening',
        part: 4,
        duration: '25 min',
        description: 'Understand business announcements, advertisements, and recorded messages',
        topics: ['Talk purpose', 'Visual questions', 'Inference questions', 'Detail questions']
    },

    // Reading Lessons
    {
        id: 'r5',
        title: 'Part 5: Vocabulary in Context',
        category: 'reading',
        part: 5,
        duration: '20 min',
        description: 'Master word choice and collocations in business contexts',
        topics: ['Word families', 'Synonyms', 'Collocations', 'Context clues']
    },
    {
        id: 'r6',
        title: 'Part 5: Grammar Essentials',
        category: 'reading',
        part: 5,
        duration: '30 min',
        description: 'Core grammar rules tested in TOEIC',
        topics: ['Verb tenses', 'Subject-verb agreement', 'Pronouns', 'Prepositions']
    },
    {
        id: 'r7',
        title: 'Part 6: Text Completion Strategies',
        category: 'reading',
        part: 6,
        duration: '25 min',
        description: 'Fill in gaps using grammar and context clues',
        topics: ['Transition words', 'Sentence insertion', 'Pronoun reference', 'Logical flow']
    },
    {
        id: 'r8',
        title: 'Part 7: Single Passage - Emails & Letters',
        category: 'reading',
        part: 7,
        duration: '30 min',
        description: 'Read business correspondence efficiently',
        topics: ['Scanning techniques', 'Purpose identification', 'Detail questions', 'Inference']
    },
    {
        id: 'r9',
        title: 'Part 7: Double & Triple Passages',
        category: 'reading',
        part: 7,
        duration: '35 min',
        description: 'Connect information across multiple texts',
        topics: ['Cross-referencing', 'Text matching', 'Synthesis questions', 'Time management']
    },

    // Grammar Deep Dives
    {
        id: 'g1',
        title: 'Verb Tenses Mastery',
        category: 'grammar',
        duration: '30 min',
        description: 'Complete guide to all tenses used in TOEIC',
        topics: ['12 tenses overview', 'Time markers', 'Perfect aspects', 'Future forms']
    },
    {
        id: 'g2',
        title: 'Conditionals & Modals',
        category: 'grammar',
        duration: '25 min',
        description: 'Master conditional sentences and modal verbs',
        topics: ['Zero to third conditionals', 'Modal verbs', 'Would/Could/Should', 'Mixed conditionals']
    },
    {
        id: 'g3',
        title: 'Relative Clauses & Conjunctions',
        category: 'grammar',
        duration: '20 min',
        description: 'Connect ideas and modify nouns effectively',
        topics: ['Defining vs non-defining', 'Which/That/Who', 'Coordinating conjunctions', 'Subordinating conjunctions']
    },

    // Strategy Lessons
    {
        id: 's1',
        title: 'Time Management Blueprint',
        category: 'strategy',
        duration: '15 min',
        description: 'Optimize your pacing for each part of the test',
        topics: ['Part-by-part timing', 'Skip strategies', 'Energy management', 'Review techniques']
    },
    {
        id: 's2',
        title: 'Eliminating Wrong Answers',
        category: 'strategy',
        duration: '20 min',
        description: 'Boost accuracy by identifying trap answers',
        topics: ['Common distractors', 'Extreme words', 'Scope issues', 'Process of elimination']
    },
    {
        id: 's3',
        title: 'Test Day Success Routine',
        category: 'strategy',
        duration: '10 min',
        description: 'Mental and physical preparation for peak performance',
        topics: ['Pre-test checklist', 'Stress management', 'Concentration tips', 'Post-test reflection']
    }
];

export default function LessonsPage() {
    const [selectedCategory, setSelectedCategory] = useState<LessonCategory | 'all'>('all');
    const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

    const categories = [
        { id: 'all', label: 'All Lessons', icon: BookOpen, color: 'text-slate-600' },
        { id: 'listening', label: 'Listening', icon: Headphones, color: 'text-blue-600' },
        { id: 'reading', label: 'Reading', icon: FileText, color: 'text-green-600' },
        { id: 'grammar', label: 'Grammar', icon: Target, color: 'text-purple-600' },
        { id: 'strategy', label: 'Strategy', icon: Target, color: 'text-orange-600' }
    ] as const;

    const filteredLessons = selectedCategory === 'all' 
        ? LESSONS 
        : LESSONS.filter(l => l.category === selectedCategory);

    const getCategoryColor = (category: LessonCategory) => {
        switch(category) {
            case 'listening': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
            case 'reading': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
            case 'grammar': return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
            case 'strategy': return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">TOEIC Lessons</h1>
                    <p className="text-muted-foreground mt-2">Structured learning path to master all test sections</p>
                </div>
            </motion.div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = selectedCategory === cat.id;
                    return (
                        <Button
                            key={cat.id}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.id as any)}
                            className="gap-2"
                        >
                            <Icon className="h-4 w-4" />
                            {cat.label}
                        </Button>
                    );
                })}
            </div>

            {/* Stats Cards - Responsive to filter */}
            {selectedCategory === 'all' ? (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{LESSONS.length}</div>
                            <p className="text-xs text-muted-foreground">Total Lessons</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-blue-600">{LESSONS.filter(l => l.category === 'listening').length}</div>
                            <p className="text-xs text-muted-foreground">Listening</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">{LESSONS.filter(l => l.category === 'reading').length}</div>
                            <p className="text-xs text-muted-foreground">Reading</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-purple-600">{LESSONS.filter(l => l.category === 'grammar').length}</div>
                            <p className="text-xs text-muted-foreground">Grammar</p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold">{filteredLessons.length}</div>
                                <p className="text-sm text-muted-foreground capitalize">{selectedCategory} Lessons</p>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    {(() => {
                                        const totalDuration = filteredLessons.reduce((acc, lesson) => {
                                            const mins = parseInt(lesson.duration.split(' ')[0]);
                                            return acc + mins;
                                        }, 0);
                                        const hours = Math.floor(totalDuration / 60);
                                        const mins = totalDuration % 60;
                                        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                                    })()}
                                </div>
                                <p className="text-xs text-muted-foreground">Total Duration</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lessons Grid */}
            <div>
                {filteredLessons.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center space-y-2">
                            <p className="text-muted-foreground">No lessons found for this category</p>
                        </div>
                    </Card>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                {selectedCategory === 'all' ? 'All Lessons' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Lessons`}
                            </h2>
                            <span className="text-sm text-muted-foreground">
                                {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'}
                            </span>
                        </div>
                        <div className={cn(
                            "grid gap-6",
                            filteredLessons.length === 1 ? "md:grid-cols-1 max-w-2xl" :
                            filteredLessons.length === 2 ? "md:grid-cols-2" :
                            "md:grid-cols-2 lg:grid-cols-3"
                        )}>
                            {filteredLessons.map((lesson, index) => (
                    <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                    <Card 
                        className={cn(
                            "transition-all cursor-pointer hover:shadow-lg flex flex-col border-2 group overflow-hidden",
                            expandedLesson === lesson.id && "ring-2 ring-primary shadow-lg"
                        )}
                        onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                    >
                        <CardHeader className="pb-3 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="space-y-2 relative z-10">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={cn("text-xs font-semibold px-3 py-1 rounded-full shadow-sm", getCategoryColor(lesson.category))}>
                                        {lesson.category.toUpperCase()}
                                    </span>
                                    {lesson.part && (
                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                            Part {lesson.part}
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-full">{lesson.duration}</span>
                                </div>
                                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{lesson.title}</CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
                            </div>
                        </CardHeader>
                        
                        {expandedLesson === lesson.id && (
                            <CardContent className="border-t pt-4 flex-1 flex flex-col">
                                <div className="space-y-3 flex-1">
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">Topics:</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {lesson.topics.map((topic, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="text-xs px-2 py-1 rounded-full bg-muted"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button className="flex-1" size="sm">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Start
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                    </motion.div>
                ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
