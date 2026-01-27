"use client";

import Link from "next/link";
import { Ticket } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { categoryLabels } from "@/lib/mock-data";
import { Clock, User, Tag } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";

interface TicketCardProps {
    ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
    return (
        <Link href={`/tickets/${ticket.id}`}>
            <Card className="group cursor-pointer transition-all hover:bg-muted/50">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {ticket.id}
                                </span>
                                <StatusBadge status={ticket.status} />
                            </div>
                            <h3 className="font-semibold text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                {ticket.subject}
                            </h3>
                        </div>
                        <PriorityIndicator priority={ticket.priority} showLabel={false} />
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {ticket.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <Tag className="h-3.5 w-3.5" />
                                <span>{categoryLabels[ticket.category]}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{formatDistanceToNow(ticket.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {ticket.assignedTo ? (
                                <>
                                    <Avatar className="h-5 w-5">
                                        <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                                            {ticket.assignedTo.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{ticket.assignedTo.name}</span>
                                </>
                            ) : (
                                <>
                                    <User className="h-3.5 w-3.5" />
                                    <span className="text-yellow-600 dark:text-yellow-400">Unassigned</span>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
