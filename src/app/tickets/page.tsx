"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Plus,
    Filter,
    SlidersHorizontal,
    LayoutGrid,
    List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketCard } from "@/components/tickets/ticket-card";
import { TicketKanban } from "@/components/tickets/ticket-kanban";
import { getStoredTickets, updateTicket } from "@/lib/storage";
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from "@/types";
import { categoryLabels, statusLabels, priorityLabels } from "@/lib/mock-data";

type ViewMode = "list" | "board";

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    useEffect(() => {
        const storedTickets = getStoredTickets();
        // Filter out pending approvals from the main list
        const activeTickets = storedTickets.filter(t => t.approvalStatus !== 'pending');
        setTickets(activeTickets);
        setFilteredTickets(activeTickets);
    }, []);

    useEffect(() => {
        let result = tickets;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.id.toLowerCase().includes(query) ||
                    t.subject.toLowerCase().includes(query) ||
                    t.description.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            result = result.filter((t) => t.status === statusFilter);
        }

        // Priority filter
        if (priorityFilter !== "all") {
            result = result.filter((t) => t.priority === priorityFilter);
        }

        // Category filter
        if (categoryFilter !== "all") {
            result = result.filter((t) => t.category === categoryFilter);
        }

        setFilteredTickets(result);
    }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter]);

    const handleTicketUpdate = (ticketId: string, newStatus: TicketStatus) => {
        const updated = updateTicket(ticketId, { status: newStatus });
        setTickets(updated);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setPriorityFilter("all");
        setCategoryFilter("all");
    };

    const activeFiltersCount = [statusFilter, priorityFilter, categoryFilter].filter(
        (f) => f !== "all"
    ).length + (searchQuery ? 1 : 0);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Tickets</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and track all support tickets
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                        <TabsList>
                            <TabsTrigger value="list" className="px-3">
                                <List className="h-4 w-4 mr-2" />
                                List
                            </TabsTrigger>
                            <TabsTrigger value="board" className="px-3">
                                <LayoutGrid className="h-4 w-4 mr-2" />
                                Board
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Link href="/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Ticket
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by ID, subject, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-4">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    {Object.entries(priorityLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.entries(categoryLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {activeFiltersCount > 0 && (
                                <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results Info (only show in list view or if needed) */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredTickets.length} of {tickets.length} tickets
                </p>
            </div>

            {/* Content Switcher */}
            {viewMode === "list" ? (
                <div className="space-y-3">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))
                    ) : (
                        <Card className="flex items-center justify-center p-12">
                            <div className="text-center">
                                <Filter className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                                <h3 className="font-semibold mb-1">No tickets found</h3>
                                <p className="text-sm text-muted-foreground">
                                    {activeFiltersCount > 0
                                        ? "Try adjusting your filters"
                                        : "Create your first ticket to get started"}
                                </p>
                                {activeFiltersCount > 0 && (
                                    <Button variant="link" onClick={clearFilters} className="mt-2">
                                        Clear all filters
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            ) : (
                <TicketKanban tickets={filteredTickets} onTicketUpdate={handleTicketUpdate} />
            )}
        </div>
    );
}
