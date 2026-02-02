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
    Lock,
    Zap,
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
import { Toggle } from "@/components/ui/toggle";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { getTicketById, updateTicket, logActivity } from "@/lib/storage";
import { ActivityFeed } from "@/components/tickets/activity-feed";
import { Ticket, TicketStatus, Comment } from "@/types";
import { categoryLabels, statusLabels, mockAgents } from "@/lib/mock-data";
import { formatDate, formatDistanceToNow } from "@/lib/utils";
import { calculateDueDate, getSLAStatus } from "@/lib/sla";

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [newComment, setNewComment] = useState("");
    const [isInternal, setIsInternal] = useState(false);
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
        const oldStatus = ticket.status;

        // Update ticket
        let updatedTickets = updateTicket(ticket.id, { status: newStatus });

        // Log activity
        if (oldStatus !== newStatus) {
            updatedTickets = logActivity(ticket.id, {
                type: 'status_changed',
                user: 'Admin User', // Mock user
                oldValue: statusLabels[oldStatus],
                newValue: statusLabels[newStatus],
            });
        }

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
            isInternal: isInternal,
        };

        const updatedComments = [...ticket.comments, comment];
        const updatedTickets = updateTicket(ticket.id, { comments: updatedComments });
        const updated = updatedTickets.find((t) => t.id === ticket.id);
        if (updated) setTicket(updated);

        setNewComment("");
        setIsInternal(false);
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
                                Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ActivityFeed ticket={ticket} />

                            <Separator />

                            {/* Add Comment */}
                            <div className="space-y-3">
                                <Textarea
                                    placeholder={isInternal ? "Add an internal note..." : "Reply to customer..."}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={3}
                                    className={`resize-none ${isInternal ? "border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20" : ""}`}
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Toggle
                                            pressed={isInternal}
                                            onPressedChange={setIsInternal}
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-900 dark:data-[state=on]:bg-yellow-900 dark:data-[state=on]:text-yellow-100"
                                        >
                                            <Lock className="h-3 w-3" />
                                            Internal Note
                                        </Toggle>

                                        {/* Canned Responses Dropdown */}
                                        <Select onValueChange={(val) => setNewComment((prev) => prev + (prev ? "\n" : "") + val)}>
                                            <SelectTrigger className="h-9 w-[130px] text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="h-3 w-3" />
                                                    <span>Templates</span>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Hi there, could you please provide more details about the error message you are seeing? Screenshots would be very helpful.">
                                                    Need More Info
                                                </SelectItem>
                                                <SelectItem value="I have looked into this and the issue should be resolved now. Please verify and let me know if you need further assistance.">
                                                    Issue Resolved
                                                </SelectItem>
                                                <SelectItem value="We are currently investigating this issue and will update you as soon as we have more information.">
                                                    Investigating
                                                </SelectItem>
                                                <SelectItem value="To reset your password, please visit the self-service portal at https://reset.company.com.">
                                                    Password Reset
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim() || isSubmitting}
                                        className="gap-2"
                                        variant={isInternal ? "secondary" : "default"}
                                    >
                                        <Send className="h-4 w-4" />
                                        {isInternal ? "Post Note" : "Send Reply"}
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

                    {/* Details */}
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
                            <Separator />
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Target Resolution</p>
                                    <p className={`text-sm font-medium ${getSLAStatus(ticket).color}`}>
                                        {formatDate(calculateDueDate(ticket).toISOString())}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attachments */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Attachments</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {ticket.attachments.map((file) => (
                                    <a
                                        key={file.id}
                                        href={file.url}
                                        download={file.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border group"
                                    >
                                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-foreground">
                                            {file.type.startsWith('image/') ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={file.url} alt="" className="h-full w-full object-cover rounded" />
                                            ) : (
                                                <Tag className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                                        </div>
                                    </a>
                                ))}
                            </CardContent>
                        </Card>
                    )}

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
