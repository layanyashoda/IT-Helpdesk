"use client";

import { useState, useMemo } from "react";
import {
    Search,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Eye,
    ThumbsUp,
    ExternalLink,
    MessageCircleQuestion,
    CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockKnowledgeArticles, categoryLabels } from "@/lib/mock-data";
import { KnowledgeArticle, TicketCategory } from "@/types";
import { SearchHighlight } from "@/components/ui/search-highlight";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function KnowledgeBasePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
    const [helpfulArticles, setHelpfulArticles] = useState<Set<string>>(new Set());

    // Group articles by category
    const articlesByCategory = useMemo(() => {
        return mockKnowledgeArticles.reduce((acc, article) => {
            if (!acc[article.category]) {
                acc[article.category] = [];
            }
            acc[article.category].push(article);
            return acc;
        }, {} as Record<string, KnowledgeArticle[]>);
    }, []);

    // Filter articles
    const filteredArticles = useMemo(() => {
        return mockKnowledgeArticles.filter((article) => {
            const matchesSearch =
                !searchQuery ||
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = !selectedCategory || article.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const categories = Object.keys(articlesByCategory) as TicketCategory[];

    const toggleArticle = (articleId: string) => {
        setExpandedArticle(expandedArticle === articleId ? null : articleId);
    };

    const handleHelpful = (e: React.MouseEvent, articleId: string) => {
        e.stopPropagation();
        const newHelpful = new Set(helpfulArticles);
        if (newHelpful.has(articleId)) {
            newHelpful.delete(articleId);
        } else {
            newHelpful.add(articleId);
        }
        setHelpfulArticles(newHelpful);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                <p className="text-muted-foreground text-lg">
                    Find answers to common IT questions and troubleshooting guides.
                </p>
            </div>

            {/* Search Area */}
            <Card className="border-muted bg-gradient-to-r from-muted/50 to-background">
                <CardContent className="pt-6">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search articles, topics, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 text-lg shadow-sm border-muted-foreground/20 focus-visible:ring-primary/30"
                        />
                    </div>
                    {/* Popular Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                        <span className="text-sm text-muted-foreground py-1">Popular:</span>
                        {["vpn", "password", "email", "security", "software", "printer"].map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors px-3 py-1 text-xs font-normal"
                                onClick={() => setSearchQuery(tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 lg:grid-cols-4 items-start">
                {/* Categories Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 bg-muted/30">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 grid gap-1">
                            <Button
                                variant={selectedCategory === null ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start font-normal",
                                    selectedCategory === null && "font-medium"
                                )}
                                onClick={() => setSelectedCategory(null)}
                            >
                                <span className="truncate">All Articles</span>
                                <Badge variant="secondary" className="ml-auto text-[10px] h-5 min-w-5 flex items-center justify-center">
                                    {mockKnowledgeArticles.length}
                                </Badge>
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start font-normal capitalize",
                                        selectedCategory === category && "font-medium"
                                    )}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    <span className="truncate">{categoryLabels[category]}</span>
                                    <Badge variant="secondary" className="ml-auto text-[10px] h-5 min-w-5 flex items-center justify-center">
                                        {articlesByCategory[category].length}
                                    </Badge>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Contact Support CTA */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <MessageCircleQuestion className="h-4 w-4 text-primary" />
                                Still need help?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground pb-4">
                            Can't find what you're looking for? Our support team is here to assist you.
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="sm">Contact Support</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Articles List */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Results Info */}
                    <div className="flex items-center justify-between pb-2 border-b">
                        <h2 className="text-lg font-semibold">
                            {selectedCategory ? categoryLabels[selectedCategory as TicketCategory] : "All Articles"}
                        </h2>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {filteredArticles.length} result{filteredArticles.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Articles */}
                    <AnimatePresence mode="popLayout">
                        {filteredArticles.length > 0 ? (
                            <div className="space-y-4">
                                {filteredArticles.map((article) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        key={article.id}
                                    >
                                        <Card
                                            className={cn(
                                                "transition-all duration-300 border hover:shadow-md group",
                                                expandedArticle === article.id ? "ring-2 ring-primary/10 border-primary/30" : "hover:border-primary/20"
                                            )}
                                        >
                                            <CardHeader
                                                className="cursor-pointer py-4"
                                                onClick={() => toggleArticle(article.id)}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 space-y-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                                                                {categoryLabels[article.category]}
                                                            </Badge>
                                                            {/* New/Updated indicators could go here */}
                                                        </div>
                                                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors flex items-start gap-2">
                                                            <div className="mt-1">
                                                                {expandedArticle === article.id ? (
                                                                    <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                ) : (
                                                                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                )}
                                                            </div>
                                                            <SearchHighlight text={article.title} searchTerm={searchQuery} />
                                                        </CardTitle>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground/60">
                                                        <div className="flex items-center gap-1.5" title="Views">
                                                            <Eye className="h-3.5 w-3.5" />
                                                            {article.views.toLocaleString()}
                                                        </div>
                                                        <div className="flex items-center gap-1.5" title="Helpful votes">
                                                            <ThumbsUp className="h-3.5 w-3.5" />
                                                            {article.helpful.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <AnimatePresence>
                                                {expandedArticle === article.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                    >
                                                        <CardContent className="pt-0 pb-2 pl-12 pr-6">

                                                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground my-4">
                                                                <div className="whitespace-pre-wrap">
                                                                    <SearchHighlight text={article.content} searchTerm={searchQuery} />
                                                                </div>
                                                            </div>

                                                            <Separator className="my-6" />

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {article.tags.map((tag) => (
                                                                        <Badge key={tag} variant="secondary" className="text-xs bg-muted/50 hover:bg-muted">
                                                                            #{tag}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                                <Button
                                                                    variant={helpfulArticles.has(article.id) ? "default" : "outline"}
                                                                    size="sm"
                                                                    className={cn(
                                                                        "gap-2 transition-all",
                                                                        helpfulArticles.has(article.id) && "bg-green-600 hover:bg-green-700 text-white border-transparent"
                                                                    )}
                                                                    onClick={(e) => handleHelpful(e, article.id)}
                                                                >
                                                                    {helpfulArticles.has(article.id) ? (
                                                                        <>
                                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                                            Marked as Helpful
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <ThumbsUp className="h-3.5 w-3.5" />
                                                                            Was this helpful?
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-muted/30"
                            >
                                <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    We couldn't find any articles matching "{searchQuery}".
                                    Try using different keywords or browse by category.
                                </p>
                                {(searchQuery || selectedCategory) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory(null);
                                        }}
                                    >
                                        Clear all filters
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

