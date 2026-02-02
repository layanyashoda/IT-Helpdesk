import { Ticket, ActivityEntry } from '@/types';
import { mockTickets } from './mock-data';

const TICKETS_KEY = 'helpdesk_tickets';

export function getStoredTickets(): Ticket[] {
    if (typeof window === 'undefined') return mockTickets;

    const stored = localStorage.getItem(TICKETS_KEY);
    if (!stored) {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(mockTickets));
        return mockTickets;
    }

    try {
        return JSON.parse(stored);
    } catch {
        return mockTickets;
    }
}

export function saveTickets(tickets: Ticket[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

export function addTicket(ticket: Ticket): Ticket[] {
    const tickets = getStoredTickets();
    tickets.unshift(ticket);
    saveTickets(tickets);
    return tickets;
}

export function updateTicket(ticketId: string, updates: Partial<Ticket>): Ticket[] {
    const tickets = getStoredTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index !== -1) {
        tickets[index] = { ...tickets[index], ...updates, updatedAt: new Date().toISOString() };
        saveTickets(tickets);
    }
    return tickets;
}

export function logActivity(ticketId: string, activity: Omit<ActivityEntry, "id" | "timestamp">): Ticket[] {
    const tickets = getStoredTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index !== -1) {
        const newActivity: ActivityEntry = {
            id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            ...activity
        };

        const currentActivities = tickets[index].activities || [];
        tickets[index] = {
            ...tickets[index],
            activities: [newActivity, ...currentActivities],
            updatedAt: new Date().toISOString()
        };

        saveTickets(tickets);
    }
    return tickets;
}

export function getTicketById(ticketId: string): Ticket | undefined {
    const tickets = getStoredTickets();
    return tickets.find(t => t.id === ticketId);
}

export function generateTicketId(): string {
    const tickets = getStoredTickets();
    const maxId = tickets.reduce((max, t) => {
        const num = parseInt(t.id.replace('TKT-', ''));
        return num > max ? num : max;
    }, 0);
    return `TKT-${String(maxId + 1).padStart(3, '0')}`;
}

export function resetToMockData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TICKETS_KEY, JSON.stringify(mockTickets));
}
