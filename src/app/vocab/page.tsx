"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload, BookOpen, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function VocabDashboard() {
    const { decks, addDeck, deleteDeck, importDeck, resetStore } = useStore();
    const [activeTab, setActiveTab] = useState<'view' | 'import'>('view');
    const [newDeckName, setNewDeckName] = useState("");
    const [importText, setImportText] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleCreateDeck = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeckName.trim()) return;
        addDeck(newDeckName);
        setNewDeckName("");
    };

    const handleImport = () => {
        if (!newDeckName.trim() || !importText.trim()) return;

        // Simple CSV Parser: Term, Meaning, Type, Example
        const lines = importText.split('\n');
        const cards = lines.map(line => {
            const parts = line.split(',');
            if (parts.length < 2) return null;
            return {
                term: parts[0]?.trim() || "",
                definition: parts[1]?.trim() || "",
                type: parts[2]?.trim() || "unknown",
                example: parts[3]?.trim() || ""
            };
        }).filter(c => c !== null);

        // @ts-ignore - TS might complain about nulls being filtered but type inference can be tricky
        importDeck(newDeckName, cards as any);
        setNewDeckName("");
        setImportText("");
        setActiveTab('view');
    };

    if (!isClient) return null;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Vocabulary Decks</h1>
                    <p className="text-muted-foreground mt-2">Master TOEIC vocabulary with interactive flashcards</p>
                </div>
                <div className="space-x-2">
                    <Button variant={activeTab === 'view' ? "default" : "outline"} onClick={() => setActiveTab('view')}>My Decks</Button>
                    <Button variant={activeTab === 'import' ? "default" : "outline"} onClick={() => setActiveTab('import')}><Upload className="mr-2 h-4 w-4" /> Import</Button>
                </div>
            </motion.div>

            {activeTab === 'view' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Card className="max-w-md flex-1">
                            <CardHeader><CardTitle>Create New Deck</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateDeck} className="flex space-x-2">
                                    <Input placeholder="Deck Name (e.g., Marketing)" value={newDeckName} onChange={e => setNewDeckName(e.target.value)} />
                                    <Button type="submit"><Plus className="h-4 w-4" /></Button>
                                </form>
                            </CardContent>
                        </Card>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                if (confirm('Reset all decks to default? This will restore all 10 TOEIC lessons and clear your progress.')) {
                                    resetStore();
                                    window.location.reload();
                                }
                            }}
                            className="ml-4"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" /> Reset Decks
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {decks.map((deck, index) => {
                            const masteredCount = deck.cards.filter(c => c.status === 'mastered').length;
                            const totalCount = deck.cards.length;
                            const progress = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;
                            return (
                                <motion.div
                                    key={deck.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden group border-2">
                                        {deck.image && (
                                            <div className="relative w-full h-40 overflow-hidden">
                                                <Image
                                                    src={deck.image}
                                                    alt={deck.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    priority={false}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                            </div>
                                        )}
                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{deck.name}</CardTitle>
                                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {masteredCount} mastered
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {totalCount} words
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => deleteDeck(deck.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-medium">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                                    <motion.div 
                                                        className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                                                <span>Learning</span>
                                                <span className="font-medium">{deck.cards.filter(c => c.status !== 'mastered').length}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Link href={`/vocab/${deck.id}`} className="w-full">
                                                <Button className="w-full group/btn">
                                                    <BookOpen className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform" /> 
                                                    Study Now
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'import' && (
                <Card>
                    <CardHeader><CardTitle>Bulk Import</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Deck Name</label>
                            <Input placeholder="New Deck Name" value={newDeckName} onChange={e => setNewDeckName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CSV Data (Term, Meaning, Type, Example)</label>
                            <textarea
                                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder={`Contract, Hợp đồng, n, We signed the contract.
Negotiate, Đàm phán, v, They negotiated the price.`}
                                value={importText}
                                onChange={e => setImportText(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleImport} disabled={!newDeckName || !importText}>Import Deck</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
