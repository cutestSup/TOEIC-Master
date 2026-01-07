"use client"

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Volume2, CheckCircle2, RotateCcw } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface LessonContent {
    id: string;
    title: string;
    category: string;
    part: number;
    sections: {
        id: string;
        title: string;
        type: 'audio' | 'image' | 'text' | 'audio-image';
        content: string;
        audioPath?: string;
        imagePath?: string;
        transcript?: string;
    }[];
}

const LESSONS_CONTENT: Record<string, LessonContent> = {
    'l1': {
        id: 'l1',
        title: 'Part 1: Photographs - Person & Object Description',
        category: 'listening',
        part: 1,
        sections: [
            {
                id: 'intro',
                title: 'Introduction to Part 1',
                type: 'audio-image',
                content: 'Part 1 tests your ability to describe photographs showing people, objects, and actions.',
                audioPath: '/audio/practices/lesson1_part1.mp3',
                imagePath: '/images/practices/lesson1_part1.png',
                transcript: 'Welcome to Part 1 practice. You will hear four statements about a photograph. Choose the statement that best describes what you see in the picture.'
            },
            {
                id: 'q1',
                title: 'Practice Question 1',
                type: 'audio-image',
                content: 'Listen carefully and select the best description.',
                audioPath: '/audio/practices/lesson1_part2_1.mp3',
                imagePath: '/images/practices/lesson1_part1.png',
                transcript: 'A) The man is reading a book. B) The woman is typing on a computer. C) People are having a meeting. D) Someone is making a phone call.'
            },
            {
                id: 'q2',
                title: 'Practice Question 2',
                type: 'audio-image',
                content: 'Another practice example with detailed explanation.',
                audioPath: '/audio/practices/lesson1_part2_2.mp3',
                imagePath: '/images/practices/lesson1_part1.png',
                transcript: 'A) The chairs are being arranged. B) The table is empty. C) Documents are on the desk. D) The room is being cleaned.'
            },
            {
                id: 'explanation',
                title: 'Key Strategies',
                type: 'text',
                content: `
**Common Patterns in Part 1:**

1. **Present Continuous vs Simple Present**
   - "The man is walking" (action in progress)
   - "The man walks to work" (general truth)

2. **Active vs Passive Voice**
   - "Workers are building" (active)
   - "A building is being constructed" (passive)

3. **Watch out for distractors:**
   - Sound-alikes: "They're reading" vs "They're ready"
   - Related words mentioned but not in picture
   - Actions that will happen but aren't happening now

4. **Focus on:**
   - Number of people (one/some/all)
   - Main action or state
   - Location and position
   - Objects and their arrangement
                `
            },
            {
                id: 'practice',
                title: 'Final Practice',
                type: 'audio',
                content: 'Complete practice set with answer explanations.',
                audioPath: '/audio/practices/lesson1_part3.mp3',
                transcript: 'Now try these three questions on your own, then we will review the answers together.'
            }
        ]
    },
    'l2': {
        id: 'l2',
        title: 'Part 2: Question-Response Patterns',
        category: 'listening',
        part: 2,
        sections: [
            {
                id: 'intro',
                title: 'Understanding Part 2',
                type: 'audio-image',
                content: 'Part 2 tests your ability to choose appropriate responses to questions and statements.',
                audioPath: '/audio/practices/lesson2_part1.mp3',
                imagePath: '/images/practices/lesson2_part1.png',
                transcript: 'In Part 2, you will hear a question or statement followed by three responses. Choose the best response.'
            },
            {
                id: 'wh-questions',
                title: 'Wh-Questions Practice',
                type: 'audio',
                content: 'Practice identifying correct responses to Who, What, When, Where, Why, and How questions.',
                audioPath: '/audio/practices/lesson2_part2_1.mp3',
                transcript: 'Question: When does the meeting start? A) In the conference room. B) At 3 PM. C) Mr. Johnson will attend.'
            },
            {
                id: 'yesno',
                title: 'Yes/No Questions',
                type: 'audio',
                content: 'Learn to recognize direct and indirect responses.',
                audioPath: '/audio/practices/lesson2_part2_2.mp3',
                transcript: 'Question: Have you finished the report? A) Yes, I submitted it yesterday. B) It\'s on my desk. C) About 10 pages.'
            },
            {
                id: 'strategies',
                title: 'Part 2 Success Strategies',
                type: 'text',
                content: `
**Key Strategies:**

1. **Listen for question words**
   - "When" → Time answer
   - "Where" → Place answer
   - "Who" → Person answer
   - "How" → Method/description

2. **Avoid echo distractors**
   - Question: "Where is the meeting?"
   - Wrong: "The meeting is at 3 PM" (echoes "meeting" but wrong type)

3. **Accept indirect responses**
   - Q: "Can you help me?"
   - Valid: "I'm a bit busy now" (indirect no)

4. **Watch for negative questions**
   - "Didn't you receive my email?"
   - Yes = "No, I didn't" (agreement with negative)
                `
            }
        ]
    },
    'l3': {
        id: 'l3',
        title: 'Part 3: Conversations - Main Idea & Details',
        category: 'listening',
        part: 3,
        sections: [
            {
                id: 'intro',
                title: 'Part 3 Overview',
                type: 'audio-image',
                content: 'Learn to extract main ideas and specific details from conversations.',
                audioPath: '/audio/practices/lesson3_part1.mp3',
                imagePath: '/images/practices/lesson3_part1.png',
                transcript: 'Part 3 features conversations between two or three people. You will answer questions about the main topic and specific details.'
            },
            {
                id: 'conversation1',
                title: 'Sample Conversation - Office Discussion',
                type: 'audio',
                content: 'Listen to this conversation and practice identifying the speakers and topic.',
                audioPath: '/audio/practices/lesson3_part2_1.mp3',
                transcript: 'Man: Hi Sarah, do you have a minute? Woman: Sure, what\'s up? Man: I need to discuss the project timeline. Woman: Let\'s go to my office.'
            },
            {
                id: 'questions',
                title: 'Common Question Types',
                type: 'text',
                content: `
**Part 3 Question Types:**

1. **Main Idea Questions**
   - "What are the speakers discussing?"
   - "What is the conversation mainly about?"

2. **Detail Questions**
   - "When will they meet?"
   - "What does the woman suggest?"

3. **Speaker Purpose/Feeling**
   - "Why does the man call?"
   - "How does the woman feel?"

4. **Next Action Questions**
   - "What will the man probably do next?"

5. **Visual Reference Questions**
   - "Look at the graphic. Which item..."
                `
            }
        ]
    },
    'l4': {
        id: 'l4',
        title: 'Part 4: Short Talks - Announcements & Messages',
        category: 'listening',
        part: 4,
        sections: [
            {
                id: 'intro',
                title: 'Understanding Part 4',
                type: 'audio-image',
                content: 'Master listening to business announcements, advertisements, and recorded messages.',
                audioPath: '/audio/practices/lesson4_part1.mp3',
                imagePath: '/images/practices/lesson4_part1.png',
                transcript: 'Part 4 consists of short talks by a single speaker. You will hear announcements, advertisements, instructions, and telephone messages.'
            },
            {
                id: 'announcement',
                title: 'Sample Announcement',
                type: 'audio',
                content: 'Practice with a typical workplace announcement.',
                audioPath: '/audio/practices/lesson4_part2_1.mp3',
                transcript: 'Attention all employees: The office will be closed next Monday for maintenance. Please plan accordingly and take any urgent materials home by Friday.'
            },
            {
                id: 'types',
                title: 'Types of Short Talks',
                type: 'text',
                content: `
**Common Talk Types:**

1. **Telephone Messages**
   - Customer service calls
   - Appointment confirmations
   - Delivery notifications

2. **Announcements**
   - Public address systems
   - Meeting notices
   - Policy changes

3. **Advertisements**
   - Product promotions
   - Store sales
   - Event invitations

4. **News/Reports**
   - Traffic updates
   - Weather forecasts
   - Business news

5. **Instructions**
   - How-to guides
   - Safety procedures
   - Tour information
                `
            }
        ]
    },
    'l5': {
        id: 'l5',
        title: 'Part 5: Vocabulary in Context',
        category: 'reading',
        part: 5,
        sections: [
            {
                id: 'intro',
                title: 'Mastering Vocabulary Questions',
                type: 'audio-image',
                content: 'Learn to choose the correct word based on meaning and context.',
                audioPath: '/audio/practices/lesson5_part1.mp3',
                imagePath: '/images/practices/lesson5_part1.png',
                transcript: 'Part 5 vocabulary questions test your knowledge of word meanings, collocations, and appropriate word choice in business contexts.'
            },
            {
                id: 'wordforms',
                title: 'Word Families',
                type: 'text',
                content: `
**Understanding Word Forms:**

**Example: "Manage"**
- manage (verb) - to control or organize
- manager (noun) - person who manages
- management (noun) - the act/process of managing
- managerial (adjective) - relating to management

**Common Patterns:**
1. Verb → Noun: develop → development
2. Noun → Adjective: success → successful
3. Adjective → Adverb: quick → quickly

**Test Example:**
"The company's new _____ strategy increased profits."
- (A) manage (verb - wrong form)
- (B) manager (noun - person, not process)
- (C) management (noun - correct!)
- (D) managerial (adjective - would need "strategy" after)
                `
            },
            {
                id: 'collocations',
                title: 'Common Business Collocations',
                type: 'text',
                content: `
**High-Frequency Collocations:**

**With "make":**
- make a decision
- make an appointment
- make progress
- make a profit

**With "take":**
- take action
- take responsibility
- take advantage
- take effect

**With "reach":**
- reach an agreement
- reach a conclusion
- reach a goal

**Preposition Partners:**
- interested IN
- responsible FOR
- familiar WITH
- capable OF
                `
            }
        ]
    },
    'l6': {
        id: 'l6',
        title: 'Part 5: Grammar Essentials',
        category: 'reading',
        part: 5,
        sections: [
            {
                id: 'intro',
                title: 'Grammar Question Types',
                type: 'audio-image',
                content: 'Master the most commonly tested grammar points in TOEIC Part 5.',
                audioPath: '/audio/practices/lesson6_part1.mp3',
                imagePath: '/images/practices/lesson6_part1.png',
                transcript: 'Part 5 grammar questions focus on sentence structure, verb forms, and word relationships.'
            },
            {
                id: 'verbtenses',
                title: 'Verb Tense Selection',
                type: 'text',
                content: `
**Key Tense Indicators:**

**Present Simple:**
- Time words: always, usually, every day
- Example: "The store opens at 9 AM."

**Present Continuous:**
- Time words: now, currently, at the moment
- Example: "We are currently hiring new staff."

**Present Perfect:**
- Time words: already, yet, since, for
- Example: "She has worked here for five years."

**Past Simple:**
- Time words: yesterday, last week, in 2020
- Example: "The meeting ended at 5 PM."

**Future (will/going to):**
- Time words: tomorrow, next week, soon
- Example: "The report will be ready tomorrow."
                `
            },
            {
                id: 'subjectverb',
                title: 'Subject-Verb Agreement',
                type: 'text',
                content: `
**Agreement Rules:**

**Singular subjects → singular verbs:**
- The manager reviews all applications.
- Each employee has a company email.

**Plural subjects → plural verbs:**
- The managers review all applications.
- Many employees have flexible schedules.

**Tricky cases:**
1. **Prepositional phrases (ignore them!):**
   - One of the reports IS missing. (not "are")
   - The price of these items HAS increased.

2. **"There is/are":**
   - There IS a meeting today. (singular)
   - There ARE several options available. (plural)

3. **Collective nouns:**
   - The team IS ready. (as a unit)
   - The staff ARE working hard. (as individuals)
                `
            }
        ]
    }
};

export default function LessonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.id as string;
    const lesson = LESSONS_CONTENT[lessonId];

    const [currentSection, setCurrentSection] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentSection]);

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <h1 className="text-2xl font-bold">Lesson Not Found</h1>
                <Link href="/lessons">
                    <Button>Back to Lessons</Button>
                </Link>
            </div>
        );
    }

    const currentSectionData = lesson.sections[currentSection];
    const progress = ((completedSections.size) / lesson.sections.length) * 100;

    const toggleAudio = () => {
        if (!audioRef.current || !currentSectionData.audioPath) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        setCompletedSections(prev => new Set([...prev, currentSection]));
        if (currentSection < lesson.sections.length - 1) {
            setCurrentSection(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentSection > 0) {
            setCurrentSection(prev => prev - 1);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <Link href="/lessons">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                PART {lesson.part}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Section {currentSection + 1} of {lesson.sections.length}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold">{lesson.title}</h1>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                        setCurrentSection(0);
                        setCompletedSections(new Set());
                    }}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restart
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Content Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{currentSectionData.title}</span>
                        {completedSections.has(currentSection) && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Audio Player */}
                    {currentSectionData.audioPath && (
                        <div className="bg-muted rounded-lg p-6">
                            <div className="flex items-center justify-center space-x-4">
                                <Button
                                    size="lg"
                                    variant="default"
                                    onClick={toggleAudio}
                                    className="rounded-full w-16 h-16"
                                >
                                    {isPlaying ? (
                                        <Pause className="h-6 w-6" />
                                    ) : (
                                        <Play className="h-6 w-6 ml-1" />
                                    )}
                                </Button>
                                <div className="flex items-center space-x-2">
                                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Click to {isPlaying ? 'pause' : 'play'} audio
                                    </span>
                                </div>
                            </div>
                            <audio
                                ref={audioRef}
                                src={currentSectionData.audioPath}
                                onEnded={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />
                        </div>
                    )}

                    {/* Image */}
                    {currentSectionData.imagePath && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                            <Image
                                src={currentSectionData.imagePath}
                                alt={currentSectionData.title}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 800px"
                            />
                        </div>
                    )}

                    {/* Text Content */}
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-base leading-relaxed whitespace-pre-line">
                            {currentSectionData.content}
                        </p>
                    </div>

                    {/* Transcript */}
                    {currentSectionData.transcript && (
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-sm">Transcript</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground italic">
                                    {currentSectionData.transcript}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentSection === 0}
                >
                    Previous
                </Button>
                
                {currentSection === lesson.sections.length - 1 ? (
                    <Link href="/lessons">
                        <Button onClick={handleNext}>
                            Complete Lesson
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                ) : (
                    <Button onClick={handleNext}>
                        Next Section
                    </Button>
                )}
            </div>
        </div>
    );
}
