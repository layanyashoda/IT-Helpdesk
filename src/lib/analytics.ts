import { Ticket, TicketStatus } from "@/types";

export interface DashboardStats {
    openTickets: number;
    inProgressTickets: number;
    resolvedToday: number;
    avgResponseTime: string;
    criticalTickets: number;
    totalTickets: number;
}

export interface ChartDataPoint {
    date: string;
    tickets: number;
}

export function calculateDashboardStats(tickets: Ticket[]): DashboardStats {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const openTickets = tickets.filter((t) => t.status === "open").length;
    const inProgressTickets = tickets.filter(
        (t) => t.status === "in_progress"
    ).length;
    const criticalTickets = tickets.filter((t) => t.priority === "critical").length;
    const totalTickets = tickets.length;

    const resolvedToday = tickets.filter((t) => {
        if (t.status !== "resolved" && t.status !== "closed") return false;
        // Assuming updatedAt is when it was resolved/closed. 
        // In a real app we'd look for the specific activity log but this is a good approximation for now.
        const updatedDate = new Date(t.updatedAt).toISOString().split("T")[0];
        return updatedDate === today;
    }).length;

    // Mock average response time as it requires complex activity log parsing
    const avgResponseTime = "2h 15m";

    return {
        openTickets,
        inProgressTickets,
        resolvedToday,
        avgResponseTime,
        criticalTickets,
        totalTickets,
    };
}

export function calculateTicketVolume(tickets: Ticket[], days: number = 30): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

        // Count tickets created on this date
        const count = tickets.filter(t => {
            const createdDate = new Date(t.createdAt).toISOString().split("T")[0];
            return createdDate === dateStr;
        }).length;

        data.push({ date: dateStr, tickets: count });
    }

    return data;
}
