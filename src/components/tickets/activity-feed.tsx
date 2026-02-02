"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/utils";
import { ActivityEntry, Comment, Ticket } from "@/types";
import { MessageSquare, RefreshCw, User, Tag, AlertCircle } from "lucide-react";

interface ActivityFeedProps {
    ticket: Ticket;
}

export function ActivityFeed({ ticket }: ActivityFeedProps) {
    const activities = ticket.activities || [];
    const comments = ticket.comments || [];

    // Combine and sort by timestamp (newest first)
    const timeline = [
        ...activities.map(a => ({ ...a, kind: 'activity' as const })),
        ...comments.map(c => ({ ...c, kind: 'comment' as const }))
    ].sort((a, b) => {
        const dateA = a.kind === 'activity' ? a.timestamp : a.createdAt;
        const dateB = b.kind === 'activity' ? b.timestamp : b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    if (timeline.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No activity yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {timeline.map((item) => {
                if (item.kind === 'comment') {
                    const comment = item as Comment & { kind: 'comment' };
                    return (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="text-xs">
                                    {comment.author.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className={`flex-1 rounded-lg p-3 ${comment.isInternal ? "bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900" : "bg-muted/50"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{comment.author.name}</span>
                                    {comment.isInternal && (
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 border-yellow-200 text-yellow-700 dark:text-yellow-400">
                                            Internal Note
                                        </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    );
                } else {
                    const activity = item as ActivityEntry & { kind: 'activity' };
                    return (
                        <div key={activity.id} className="flex gap-3 relative before:absolute before:left-[15px] before:top-8 before:bottom-[-24px] before:w-px before:bg-border last:before:hidden">
                            <div className="h-8 w-8 rounded-full border bg-background flex items-center justify-center z-10">
                                <ActivityIcon type={activity.type} />
                            </div>
                            <div className="pt-1.5 pb-4">
                                <div className="text-sm">
                                    <span className="font-medium">{activity.user}</span>
                                    {" "}
                                    <span className="text-muted-foreground">{getActivityText(activity)}</span>
                                    {" "}
                                    {activity.oldValue && activity.newValue && (
                                        <span className="font-medium">
                                            {activity.oldValue} <span className="text-muted-foreground">→</span> {activity.newValue}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {formatDistanceToNow(activity.timestamp)}
                                </div>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}

function ActivityIcon({ type }: { type: ActivityEntry['type'] }) {
    switch (type) {
        case 'status_changed':
            return <RefreshCw className="h-3.5 w-3.5 text-blue-500" />;
        case 'priority_changed':
            return <AlertCircle className="h-3.5 w-3.5 text-orange-500" />;
        case 'assigned':
            return <User className="h-3.5 w-3.5 text-purple-500" />;
        default:
            return <Tag className="h-3.5 w-3.5 text-muted-foreground" />;
    }
}

function getActivityText(activity: ActivityEntry) {
    const details = activity.details || "";
    switch (activity.type) {
        case 'created':
            return 'created this ticket';
        case 'status_changed':
            return 'changed status';
        case 'priority_changed':
            return 'changed priority';
        case 'assigned':
            return 'assigned to';
        case 'resolved':
            return 'resolved this ticket';
        case 'reopened':
            return 'reopened this ticket';
        default:
            return details;
    }
}
