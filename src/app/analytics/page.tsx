"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Ticket,
    CheckCircle,
    Clock,
    AlertTriangle,
    Download,
    Loader2,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { getStoredTickets } from "@/lib/storage";
import { Ticket as TicketType } from "@/types";

// Chart colors
const COLORS = {
    primary: "hsl(var(--primary))",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    red: "#ef4444",
    purple: "#a855f7",
    orange: "#f97316",
    cyan: "#06b6d4",
};

const STATUS_COLORS: Record<string, string> = {
    open: COLORS.yellow,
    in_progress: COLORS.blue,
    resolved: COLORS.green,
    closed: COLORS.purple,
};

const PRIORITY_COLORS: Record<string, string> = {
    low: COLORS.green,
    medium: COLORS.yellow,
    high: COLORS.orange,
    critical: COLORS.red,
};

const CATEGORY_COLORS: Record<string, string> = {
    hardware: COLORS.blue,
    software: COLORS.purple,
    network: COLORS.cyan,
    email: COLORS.yellow,
    security: COLORS.red,
    access: COLORS.orange,
    other: "#6b7280",
};

interface ChartData {
    ticketsByDay: { date: string; tickets: number }[];
    statusDistribution: { name: string; value: number; color: string }[];
    priorityDistribution: { name: string; value: number; color: string }[];
    categoryDistribution: { name: string; value: number; color: string }[];
}

function generateChartData(tickets: TicketType[]): ChartData {
    // Tickets by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
    });

    const ticketsByDay = last7Days.map((date) => {
        const count = tickets.filter(
            (t) => t.createdAt.split("T")[0] === date
        ).length;
        return {
            date: new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
            }),
            tickets: count,
        };
    });

    // Status distribution
    const statusCounts: Record<string, number> = {
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0,
    };
    tickets.forEach((t) => {
        statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    });
    const statusDistribution = Object.entries(statusCounts).map(
        ([name, value]) => ({
            name: name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            value,
            color: STATUS_COLORS[name],
        })
    );

    // Priority distribution
    const priorityCounts: Record<string, number> = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
    };
    tickets.forEach((t) => {
        priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
    });
    const priorityDistribution = Object.entries(priorityCounts).map(
        ([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: PRIORITY_COLORS[name],
        })
    );

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    tickets.forEach((t) => {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categoryCounts)
        .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: CATEGORY_COLORS[name] || "#6b7280",
        }))
        .sort((a, b) => b.value - a.value);

    return {
        ticketsByDay,
        statusDistribution,
        priorityDistribution,
        categoryDistribution,
    };
}

export default function AnalyticsPage() {
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const storedTickets = getStoredTickets();
        setTickets(storedTickets);
        setChartData(generateChartData(storedTickets));
    }, []);

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            let yPos = 20;

            // Title
            pdf.setFontSize(22);
            pdf.setFont("helvetica", "bold");
            pdf.text("IT Help Desk Analytics Report", pdfWidth / 2, yPos, { align: "center" });
            yPos += 10;

            // Date
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generated on ${new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })}`, pdfWidth / 2, yPos, { align: "center" });
            yPos += 15;

            // Reset text color
            pdf.setTextColor(0, 0, 0);

            // Summary Statistics Section
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text("Summary Statistics", 20, yPos);
            yPos += 10;

            pdf.setFontSize(11);
            pdf.setFont("helvetica", "normal");

            const statItems = [
                { label: "Total Tickets", value: stats.total.toString() },
                { label: "Open Tickets", value: stats.open.toString() },
                { label: "In Progress", value: stats.inProgress.toString() },
                { label: "Resolved", value: stats.resolved.toString() },
                { label: "Critical Issues", value: stats.critical.toString() },
                { label: "Resolution Rate", value: `${resolutionRate}%` },
            ];

            // Draw stats in a table-like format
            statItems.forEach((item, index) => {
                const xPos = index % 2 === 0 ? 25 : 110;
                if (index % 2 === 0 && index > 0) yPos += 8;
                pdf.setFont("helvetica", "normal");
                pdf.text(`${item.label}:`, xPos, yPos);
                pdf.setFont("helvetica", "bold");
                pdf.text(item.value, xPos + 45, yPos);
            });
            yPos += 15;

            // Status Distribution Section
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text("Status Distribution", 20, yPos);
            yPos += 10;

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            if (chartData) {
                chartData.statusDistribution.forEach((item) => {
                    pdf.text(`• ${item.name}: ${item.value} tickets`, 25, yPos);
                    yPos += 6;
                });
            }
            yPos += 5;

            // Priority Distribution Section
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text("Priority Breakdown", 20, yPos);
            yPos += 10;

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            if (chartData) {
                chartData.priorityDistribution.forEach((item) => {
                    pdf.text(`• ${item.name}: ${item.value} tickets`, 25, yPos);
                    yPos += 6;
                });
            }
            yPos += 5;

            // Category Distribution Section
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text("Category Overview", 20, yPos);
            yPos += 10;

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            if (chartData) {
                chartData.categoryDistribution.forEach((item) => {
                    pdf.text(`• ${item.name}: ${item.value} tickets`, 25, yPos);
                    yPos += 6;
                });
            }

            // Footer
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text("IT Help Desk - Analytics Report", pdfWidth / 2, 285, { align: "center" });

            pdf.save(`analytics-report-${new Date().toISOString().split("T")[0]}.pdf`);
        } catch (error) {
            console.error("Error exporting PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "open").length,
        inProgress: tickets.filter((t) => t.status === "in_progress").length,
        resolved: tickets.filter((t) => t.status === "resolved").length,
        critical: tickets.filter(
            (t) => t.priority === "critical" && t.status !== "closed"
        ).length,
    };

    const resolutionRate =
        tickets.length > 0
            ? Math.round(
                (tickets.filter((t) => t.status === "resolved" || t.status === "closed")
                    .length /
                    tickets.length) *
                100
            )
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart3 className="h-7 w-7" />
                        Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track your help desk performance and ticket trends.
                    </p>
                </div>
                <Button onClick={handleExportPDF} disabled={isExporting} className="gap-2">
                    {isExporting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download className="h-4 w-4" />
                            Export PDF
                        </>
                    )}
                </Button>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Tickets
                            </CardTitle>
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Open Tickets
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.open}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Awaiting action
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Resolution Rate
                            </CardTitle>
                            {resolutionRate >= 50 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{resolutionRate}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {resolutionRate >= 70 ? "Great progress!" : "Needs attention"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Critical Issues
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.critical}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Require immediate attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Ticket Trend Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Ticket Trends</CardTitle>
                            <CardDescription>New tickets over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                {chartData && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData.ticketsByDay}>
                                            <defs>
                                                <linearGradient
                                                    id="ticketGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor={COLORS.blue}
                                                        stopOpacity={0.3}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor={COLORS.blue}
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="stroke-muted"
                                            />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                className="text-muted-foreground"
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                className="text-muted-foreground"
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--popover))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="tickets"
                                                stroke={COLORS.blue}
                                                strokeWidth={2}
                                                fill="url(#ticketGradient)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Distribution</CardTitle>
                            <CardDescription>Tickets by current status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px]">
                                {chartData && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData.statusDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {chartData.statusDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--popover))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Priority Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Priority Breakdown</CardTitle>
                            <CardDescription>Tickets by priority level</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px]">
                                {chartData && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData.priorityDistribution} layout="vertical">
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="stroke-muted"
                                                horizontal={true}
                                                vertical={false}
                                            />
                                            <XAxis
                                                type="number"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                width={80}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--popover))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                {chartData.priorityDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Distribution */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Category Overview</CardTitle>
                            <CardDescription>Tickets grouped by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px]">
                                {chartData && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData.categoryDistribution}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                className="stroke-muted"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--popover))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {chartData.categoryDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
