"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload, BookOpen } from "lucide-react";

export default function VocabDashboard() {
    const { decks, addDeck, deleteDeck, importDeck } = useStore();
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
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Vocabulary Decks</h1>
                <div className="space-x-2">
                    <Button variant={activeTab === 'view' ? "default" : "outline"} onClick={() => setActiveTab('view')}>My Decks</Button>
                    <Button variant={activeTab === 'import' ? "default" : "outline"} onClick={() => setActiveTab('import')}><Upload className="mr-2 h-4 w-4" /> Import</Button>
                </div>
            </div>

            {activeTab === 'view' && (
                <div className="space-y-6">
                    <Card className="max-w-md">
                        <CardHeader><CardTitle>Create New Deck</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateDeck} className="flex space-x-2">
                                <Input placeholder="Deck Name (e.g., Marketing)" value={newDeckName} onChange={e => setNewDeckName(e.target.value)} />
                                <Button type="submit"><Plus className="h-4 w-4" /></Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {decks.map(deck => (
                            <Card key={deck.id} className="hover:border-primary/50 transition-colors overflow-hidden">
                                {deck.image && (
                                    <div className="relative w-full h-36">
                                        <Image
                                            src={deck.image}
                                            alt={deck.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            priority={false}
                                        />
                                    </div>
                                )}
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div>
                                        <CardTitle className="text-lg font-bold">{deck.name}</CardTitle>
                                        <div className="mt-1 text-sm text-muted-foreground">
                                            {deck.cards.filter(c => c.status === 'mastered').length} mastered · {deck.cards.length} words
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteDeck(deck.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>Learning</span>
                                        <span>{deck.cards.filter(c => c.status !== 'mastered').length}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/vocab/${deck.id}`} className="w-full">
                                        <Button className="w-full"><BookOpen className="mr-2 h-4 w-4" /> Study Now</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
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
