"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    User,
    Tag,
    MessageSquare,
    Send,
    Edit,
    AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { getTicketById, updateTicket, getStoredTickets } from "@/lib/storage";
import { Ticket, TicketStatus, Comment } from "@/types";
import { categoryLabels, statusLabels, mockAgents } from "@/lib/mock-data";
import { formatDate, formatDistanceToNow } from "@/lib/utils";

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const ticketId = params.id as string;
        const foundTicket = getTicketById(ticketId);
        if (foundTicket) {
            setTicket(foundTicket);
        }
    }, [params.id]);

    const handleStatusChange = (newStatus: TicketStatus) => {
        if (!ticket) return;
        const updatedTickets = updateTicket(ticket.id, { status: newStatus });
        const updated = updatedTickets.find((t) => t.id === ticket.id);
        if (updated) setTicket(updated);
    };

    const handleAddComment = () => {
        if (!ticket || !newComment.trim()) return;
        setIsSubmitting(true);

        const comment: Comment = {
            id: `comment-${Date.now()}`,
            ticketId: ticket.id,
            author: mockAgents[0], // Current user (mock)
            content: newComment.trim(),
            createdAt: new Date().toISOString(),
            isInternal: false,
        };

        const updatedComments = [...ticket.comments, comment];
        const updatedTickets = updateTicket(ticket.id, { comments: updatedComments });
        const updated = updatedTickets.find((t) => t.id === ticket.id);
        if (updated) setTicket(updated);

        setNewComment("");
        setIsSubmitting(false);
    };

    if (!ticket) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                        <h2 className="text-lg font-semibold mb-2">Ticket Not Found</h2>
                        <p className="text-muted-foreground text-center mb-4">
                            The ticket you&apos;re looking for doesn&apos;t exist or has been removed.
                        </p>
                        <Link href="/tickets">
                            <Button>Back to Tickets</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button & Actions */}
            <div className="flex items-center justify-between">
                <Link href="/tickets">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tickets
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {ticket.id}
                                        </span>
                                        <StatusBadge status={ticket.status} />
                                        <PriorityIndicator priority={ticket.priority} />
                                    </div>
                                    <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                                    <CardDescription className="mt-2">
                                        Created by {ticket.createdBy.name} • {formatDistanceToNow(ticket.createdAt)}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-foreground whitespace-pre-wrap">{ticket.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments / Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Activity ({ticket.comments.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ticket.comments.length > 0 ? (
                                ticket.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className={`flex gap-3 p-4 rounded-lg border ${comment.isInternal
                                            ? "bg-muted/50 border-border"
                                            : "bg-muted/30 border-transparent"
                                            }`}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                                {comment.author.name.split(" ").map((n) => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm">{comment.author.name}</span>
                                                {comment.isInternal && (
                                                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
                                                        Internal Note
                                                    </span>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No comments yet</p>
                                </div>
                            )}

                            <Separator />

                            {/* Add Comment */}
                            <div className="space-y-3">
                                <Textarea
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={3}
                                    className="resize-none"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim() || isSubmitting}
                                        className="gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        Send Reply
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status Update */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Update Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={ticket.status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Ticket Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Category</p>
                                    <p className="text-sm font-medium">{categoryLabels[ticket.category]}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Created</p>
                                    <p className="text-sm font-medium">{formatDate(ticket.createdAt)}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                    <p className="text-sm font-medium">{formatDate(ticket.updatedAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requester */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Requester</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>
                                        {ticket.createdBy.name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">{ticket.createdBy.name}</p>
                                    <p className="text-xs text-muted-foreground">{ticket.createdBy.email}</p>
                                    <p className="text-xs text-muted-foreground">{ticket.createdBy.department}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assigned Agent */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Assigned To</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ticket.assignedTo ? (
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {ticket.assignedTo.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{ticket.assignedTo.name}</p>
                                        <p className="text-xs text-muted-foreground">{ticket.assignedTo.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400">
                                    <User className="h-5 w-5" />
                                    <span className="text-sm font-medium">Unassigned</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
