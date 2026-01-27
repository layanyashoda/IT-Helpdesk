"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/tickets/ticket-card";
import { getStoredTickets } from "@/lib/storage";
import { Ticket as TicketType, DashboardStats } from "@/types";

export default function DashboardPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    openTickets: 0,
    inProgressTickets: 0,
    resolvedToday: 0,
    avgResponseTime: "2.5 hours",
    criticalTickets: 0,
    totalTickets: 0,
  });

  useEffect(() => {
    const storedTickets = getStoredTickets();
    setTickets(storedTickets);

    // Calculate stats
    const today = new Date().toDateString();
    setStats({
      openTickets: storedTickets.filter(t => t.status === 'open').length,
      inProgressTickets: storedTickets.filter(t => t.status === 'in_progress').length,
      resolvedToday: storedTickets.filter(t =>
        t.status === 'resolved' && new Date(t.updatedAt).toDateString() === today
      ).length,
      avgResponseTime: "2.5 hours",
      criticalTickets: storedTickets.filter(t => t.priority === 'critical' && t.status !== 'closed').length,
      totalTickets: storedTickets.length,
    });
  }, []);

  const recentTickets = tickets.slice(0, 5);

  const statCards = [
    {
      title: "Open Tickets",
      value: stats.openTickets,
      description: "Awaiting assignment",
      icon: Ticket,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "In Progress",
      value: stats.inProgressTickets,
      description: "Being worked on",
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Resolved Today",
      value: stats.resolvedToday,
      description: "Successfully closed",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Critical",
      value: stats.criticalTickets,
      description: "Needs immediate attention",
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s an overview of your IT Help Desk.
          </p>
        </div>
        <Link href="/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Tickets */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Tickets</h2>
            <Link href="/tickets">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentTickets.length > 0 ? (
              recentTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <Card className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Ticket className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No tickets yet</p>
                  <Link href="/create">
                    <Button variant="link" className="mt-2">
                      Create your first ticket
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Stats</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Overview</CardTitle>
              <CardDescription>This week&apos;s metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tickets</span>
                <span className="font-semibold">{stats.totalTickets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <span className="font-semibold">{stats.avgResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Resolution Rate</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-600 dark:text-green-400">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-0">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check our knowledge base for common solutions and troubleshooting guides.
              </p>
              <Link href="/knowledge">
                <Button variant="default" size="sm" className="w-full">
                  Browse Knowledge Base
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
