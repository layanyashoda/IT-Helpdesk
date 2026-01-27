"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search as SearchIcon, Ticket, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { mockTickets, mockKnowledgeArticles } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
    };

    const lowerQuery = query.toLowerCase();

    const filteredTickets = mockTickets.filter(
        (ticket) =>
            ticket.subject.toLowerCase().includes(lowerQuery) ||
            ticket.description.toLowerCase().includes(lowerQuery) ||
            ticket.id.toLowerCase().includes(lowerQuery)
    );

    const filteredArticles = mockKnowledgeArticles.filter(
        (article) =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.content.toLowerCase().includes(lowerQuery)
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
                <p className="text-muted-foreground">
                    Search across tickets, articles, and more.
                </p>
            </div>

            <Separator />

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search tickets, articles, users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit">Search</Button>
            </form>

            {/* Results */}
            {hasSearched && query && (
                <div className="space-y-6">
                    {/* Tickets Results */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Ticket className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
                            </div>
                            <CardDescription>
                                Matching support tickets
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredTickets.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredTickets.slice(0, 5).map((ticket) => (
                                        <Link
                                            key={ticket.id}
                                            href={`/tickets/${ticket.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{ticket.subject}</span>
                                                    <span className="text-xs text-muted-foreground">{ticket.id}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <StatusBadge status={ticket.status} />
                                                    <PriorityIndicator priority={ticket.priority} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </div>
                                        </Link>
                                    ))}
                                    {filteredTickets.length > 5 && (
                                        <p className="text-sm text-muted-foreground text-center pt-2">
                                            And {filteredTickets.length - 5} more results...
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No tickets found matching your search.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Articles Results */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Knowledge Articles ({filteredArticles.length})</CardTitle>
                            </div>
                            <CardDescription>
                                Matching help articles
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredArticles.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredArticles.slice(0, 5).map((article) => (
                                        <Link
                                            key={article.id}
                                            href="/knowledge"
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <span className="font-medium">{article.title}</span>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {article.content.substring(0, 100)}...
                                                </p>
                                            </div>
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {article.category}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No articles found matching your search.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Empty State */}
            {!hasSearched && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <SearchIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">Start searching</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1">
                        Enter a search term above to find tickets, knowledge base articles, and more.
                    </p>
                </div>
            )}

            {hasSearched && !query && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <SearchIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">Enter a search term</h3>
                    <p className="text-sm text-muted-foreground">
                        Please enter something to search for.
                    </p>
                </div>
            )}
        </div>
    );
}
