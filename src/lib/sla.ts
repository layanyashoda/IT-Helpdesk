import { Ticket, TicketPriority } from "@/types";
import { addHours, addDays, addWeeks, differenceInHours, differenceInMinutes, formatDistanceToNow } from "date-fns";

// SLA durations in hours
export const SLA_HOURS: Record<TicketPriority, number> = {
    critical: 4,
    high: 24,
    medium: 72, // 3 days
    low: 168,   // 1 week
};

export function calculateDueDate(ticket: Ticket): Date {
    const created = new Date(ticket.createdAt);
    const hours = SLA_HOURS[ticket.priority];
    return addHours(created, hours);
}

export function getSLAStatus(ticket: Ticket) {
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
        return { status: 'completed', label: 'Completed' };
    }

    const dueDate = calculateDueDate(ticket);
    const now = new Date();
    const diffHours = differenceInHours(dueDate, now);
    const diffMinutes = differenceInMinutes(dueDate, now);

    if (diffMinutes < 0) {
        return {
            status: 'overdue',
            label: `${formatDistanceToNow(dueDate)} overdue`,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            borderColor: 'border-red-200 dark:border-red-800'
        };
    }

    if (diffHours < 4) {
        return {
            status: 'critical',
            label: `${diffHours}h ${diffMinutes % 60}m left`,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            borderColor: 'border-orange-200 dark:border-orange-800'
        };
    }

    return {
        status: 'on-track',
        label: `${formatDistanceToNow(dueDate, { addSuffix: true })}`,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-200 dark:border-green-800'
    };
}
