"use client";

import { useState } from "react";
import {
    Search,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Eye,
    ThumbsUp,
    ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockKnowledgeArticles, categoryLabels } from "@/lib/mock-data";
import { KnowledgeArticle, TicketCategory } from "@/types";

export default function KnowledgeBasePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

    // Group articles by category
    const articlesByCategory = mockKnowledgeArticles.reduce((acc, article) => {
        if (!acc[article.category]) {
            acc[article.category] = [];
        }
        acc[article.category].push(article);
        return acc;
    }, {} as Record<string, KnowledgeArticle[]>);

    // Filter articles
    const filteredArticles = mockKnowledgeArticles.filter((article) => {
        const matchesSearch =
            !searchQuery ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = !selectedCategory || article.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const categories = Object.keys(articlesByCategory) as TicketCategory[];

    const toggleArticle = (articleId: string) => {
        setExpandedArticle(expandedArticle === articleId ? null : articleId);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Knowledge Base</h1>
                <p className="text-muted-foreground mt-1">
                    Find answers to common IT questions and troubleshooting guides
                </p>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search articles, topics, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 text-base"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Categories Sidebar */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <Button
                                variant={selectedCategory === null ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setSelectedCategory(null)}
                            >
                                <BookOpen className="mr-2 h-4 w-4" />
                                All Articles
                                <Badge variant="outline" className="ml-auto">
                                    {mockKnowledgeArticles.length}
                                </Badge>
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {categoryLabels[category]}
                                    <Badge variant="outline" className="ml-auto">
                                        {articlesByCategory[category].length}
                                    </Badge>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Popular Tags */}
                    <Card className="mt-4">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Popular Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {["vpn", "password", "email", "security", "software", "printer"].map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-accent"
                                        onClick={() => setSearchQuery(tag)}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Articles List */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Results Info */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
                            {selectedCategory && ` in ${categoryLabels[selectedCategory as TicketCategory]}`}
                        </p>
                    </div>

                    {/* Articles */}
                    {filteredArticles.length > 0 ? (
                        <div className="space-y-3">
                            {filteredArticles.map((article) => (
                                <Card
                                    key={article.id}
                                    className={`transition-all duration-200 border ${expandedArticle === article.id ? "bg-muted/30" : "hover:bg-muted/50"
                                        }`}
                                >
                                    <CardHeader
                                        className="cursor-pointer pb-3"
                                        onClick={() => toggleArticle(article.id)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {categoryLabels[article.category]}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                                                    {expandedArticle === article.id ? (
                                                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                                    )}
                                                    {article.title}
                                                </CardTitle>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    {article.views.toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-3.5 w-3.5" />
                                                    {article.helpful.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {expandedArticle === article.id && (
                                        <CardContent className="pt-0">
                                            <Separator className="mb-4" />
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <div className="whitespace-pre-wrap text-sm text-foreground">
                                                    {article.content}
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-2">
                                                    {article.tags.map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 dark:text-blue-400 gap-1"
                                                >
                                                    Was this helpful?
                                                    <ThumbsUp className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="flex items-center justify-center p-12">
                            <div className="text-center">
                                <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                                <h3 className="font-semibold mb-1">No articles found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search or browse by category
                                </p>
                                {(searchQuery || selectedCategory) && (
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory(null);
                                        }}
                                        className="mt-2"
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
