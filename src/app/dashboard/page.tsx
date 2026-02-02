"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { TicketCard } from "@/components/tickets/ticket-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredTickets } from "@/lib/storage";
import { calculateDashboardStats, calculateTicketVolume, DashboardStats, ChartDataPoint } from "@/lib/analytics";
import { Ticket } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    openTickets: 0,
    inProgressTickets: 0,
    resolvedToday: 0,
    avgResponseTime: "0m",
    criticalTickets: 0,
    totalTickets: 0,
  });
  const [volumeData, setVolumeData] = useState<ChartDataPoint[]>([]);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const tickets = getStoredTickets();

    setStats(calculateDashboardStats(tickets));
    setVolumeData(calculateTicketVolume(tickets, 90)); // Get last 90 days
    setRecentTickets(tickets.slice(0, 5)); // Top 5 recent
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 md:gap-6">
        <SectionCards stats={stats} />
        <div className="px-0">
          <ChartAreaInteractive data={volumeData} />
        </div>

        {/* Recent Tickets Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold tracking-tight">Recent Tickets</h2>
            <Link href="/tickets">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentTickets.length > 0 ? (
              recentTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <Card>
                <CardContent className="h-24 flex items-center justify-center text-muted-foreground">
                  No recent tickets found.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
