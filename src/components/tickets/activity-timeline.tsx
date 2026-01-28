"use client"

import {
    PlusCircle,
    RefreshCw,
    UserCheck,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    Clock,
    ArrowRight,
} from "lucide-react"
import { ActivityEntry, ActivityType } from "@/types"
import { cn } from "@/lib/utils"

interface ActivityTimelineProps {
    activities: ActivityEntry[]
    className?: string
}

const activityConfig: Record<ActivityType, { icon: React.ElementType; color: string; label: string }> = {
    created: {
        icon: PlusCircle,
        color: "text-blue-500 bg-blue-500/10",
        label: "Ticket created"
    },
    status_changed: {
        icon: RefreshCw,
        color: "text-yellow-500 bg-yellow-500/10",
        label: "Status changed"
    },
    priority_changed: {
        icon: AlertCircle,
        color: "text-orange-500 bg-orange-500/10",
        label: "Priority changed"
    },
    assigned: {
        icon: UserCheck,
        color: "text-purple-500 bg-purple-500/10",
        label: "Assigned"
    },
    comment_added: {
        icon: MessageSquare,
        color: "text-gray-500 bg-gray-500/10",
        label: "Comment added"
    },
    resolved: {
        icon: CheckCircle,
        color: "text-green-500 bg-green-500/10",
        label: "Resolved"
    },
    reopened: {
        icon: RefreshCw,
        color: "text-red-500 bg-red-500/10",
        label: "Reopened"
    },
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className={cn("text-center py-8 text-muted-foreground", className)}>
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity recorded yet</p>
            </div>
        )
    }

    return (
        <div className={cn("space-y-4", className)}>
            {activities.map((activity, index) => {
                const config = activityConfig[activity.type]
                const Icon = config.icon

                return (
                    <div key={activity.id} className="flex gap-3">
                        {/* Timeline line and dot */}
                        <div className="flex flex-col items-center">
                            <div className={cn("p-2 rounded-full", config.color)}>
                                <Icon className="h-4 w-4" />
                            </div>
                            {index < activities.length - 1 && (
                                <div className="w-px h-full min-h-6 bg-border mt-2" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{config.label}</p>
                                <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(activity.timestamp)}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground mt-0.5">
                                by {activity.user}
                            </p>

                            {activity.details && (
                                <p className="text-sm mt-1">{activity.details}</p>
                            )}

                            {activity.oldValue && activity.newValue && (
                                <div className="flex items-center gap-2 mt-2 text-xs">
                                    <span className="px-2 py-1 rounded bg-muted">{activity.oldValue}</span>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                    <span className="px-2 py-1 rounded bg-muted">{activity.newValue}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
