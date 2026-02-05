"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Clock, User, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStoredTickets, updateTicket } from "@/lib/storage";
import { Ticket } from "@/types";
import { toast } from "sonner";
import { mockUsers } from "@/lib/mock-data";

export default function ApprovalsPage() {
    const [pendingTickets, setPendingTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = () => {
            const allTickets = getStoredTickets();
            // In a real app, we would filter by the logged-in user's ID.
            // For this prototype, we'll show all pending approvals but ideally, it should be:
            // t.approvalStatus === 'pending' && t.approverId === currentUser.id
            const pending = allTickets.filter(t => t.approvalStatus === 'pending');
            setPendingTickets(pending);
            setIsLoading(false);
        };

        fetchTickets();
    }, []);

    const handleApprove = (ticketId: string) => {
        const updated = updateTicket(ticketId, {
            approvalStatus: 'approved',
            status: 'open', // Ensure it's open once approved
            activities: [
                ...(getStoredTickets().find(t => t.id === ticketId)?.activities || []),
                {
                    id: `act-${Date.now()}`,
                    type: 'status_changed',
                    timestamp: new Date().toISOString(),
                    user: 'Current User', // In a real app this would be the logged in user
                    details: 'Ticket approved'
                }
            ]
        });

        // Refresh list
        setPendingTickets(prev => prev.filter(t => t.id !== ticketId));
        toast.success("Ticket approved successfully");
    };

    const handleReject = (ticketId: string) => {
        const updated = updateTicket(ticketId, {
            approvalStatus: 'rejected',
            status: 'closed', // Close rejected tickets
            activities: [
                ...(getStoredTickets().find(t => t.id === ticketId)?.activities || []),
                {
                    id: `act-${Date.now()}`,
                    type: 'status_changed',
                    timestamp: new Date().toISOString(),
                    user: 'Current User',
                    details: 'Ticket rejected'
                }
            ]
        });

        // Refresh list
        setPendingTickets(prev => prev.filter(t => t.id !== ticketId));
        toast.success("Ticket rejected");
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading approvals...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Pending Approvals</h1>
                <p className="text-muted-foreground mt-1">
                    Review and approve ticket requests
                </p>
            </div>

            {pendingTickets.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Check className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No pending approvals</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm">
                        There are no tickets currently waiting for your approval.
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingTickets.map((ticket) => (
                        <Card key={ticket.id} className="flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <Badge variant="outline" className="mb-2">
                                        {ticket.category}
                                    </Badge>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Pending
                                    </Badge>
                                </div>
                                <CardTitle className="text-base line-clamp-1">
                                    {ticket.subject}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {ticket.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 text-sm space-y-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>Requested by: <span className="text-foreground font-medium">{ticket.createdBy.name}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    <span>Type: {ticket.requestType?.replace('_', ' ') || 'N/A'}</span>
                                </div>
                                {ticket.approverId && (
                                    <div className="text-xs bg-muted/50 p-2 rounded">
                                        Approver: {mockUsers.find(u => u.id === ticket.approverId)?.name || ticket.approverId}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-between gap-3 border-t bg-muted/20">
                                <Link href={`/tickets/${ticket.id}`} className="flex-1">
                                    <Button variant="ghost" size="sm" className="w-full text-xs">
                                        View Details
                                    </Button>
                                </Link>
                                <div className="flex gap-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleReject(ticket.id)}
                                        className="h-8 w-8 p-0"
                                        title="Reject"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleApprove(ticket.id)}
                                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                        title="Approve"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
