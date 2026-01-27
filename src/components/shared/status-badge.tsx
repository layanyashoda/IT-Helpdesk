import { TicketStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusLabels } from "@/lib/mock-data";
import { Circle, Clock, CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
    status: TicketStatus;
    className?: string;
}

const statusConfig: Record<TicketStatus, {
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
    icon: React.ElementType;
}> = {
    open: {
        variant: "outline",
        className: "border-amber-500/50 text-amber-600 dark:text-amber-400",
        icon: Circle,
    },
    in_progress: {
        variant: "outline",
        className: "border-blue-500/50 text-blue-600 dark:text-blue-400",
        icon: Clock,
    },
    resolved: {
        variant: "outline",
        className: "border-green-500/50 text-green-600 dark:text-green-400",
        icon: CheckCircle,
    },
    closed: {
        variant: "outline",
        className: "text-muted-foreground",
        icon: XCircle,
    },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={cn(
                "gap-1.5 font-medium",
                config.className,
                className
            )}
        >
            <Icon className="h-3 w-3" />
            {statusLabels[status]}
        </Badge>
    );
}
