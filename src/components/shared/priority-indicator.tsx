import { TicketPriority } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { priorityLabels } from "@/lib/mock-data";
import { AlertTriangle, ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

interface PriorityIndicatorProps {
    priority: TicketPriority;
    showLabel?: boolean;
    className?: string;
}

const priorityConfig: Record<TicketPriority, {
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
    icon: React.ElementType;
    iconClassName?: string;
}> = {
    critical: {
        variant: "outline",
        className: "border-red-500/50 text-red-600 dark:text-red-400",
        icon: AlertTriangle,
        iconClassName: "text-red-600 dark:text-red-400",
    },
    high: {
        variant: "outline",
        className: "border-orange-500/50 text-orange-600 dark:text-orange-400",
        icon: ArrowUp,
        iconClassName: "text-orange-600 dark:text-orange-400",
    },
    medium: {
        variant: "outline",
        className: "border-yellow-500/50 text-yellow-600 dark:text-yellow-400",
        icon: ArrowRight,
        iconClassName: "text-yellow-600 dark:text-yellow-400",
    },
    low: {
        variant: "outline",
        className: "text-muted-foreground",
        icon: ArrowDown,
        iconClassName: "text-muted-foreground",
    },
};

export function PriorityIndicator({ priority, showLabel = true, className }: PriorityIndicatorProps) {
    const config = priorityConfig[priority];
    const Icon = config.icon;

    if (!showLabel) {
        return <Icon className={cn("h-4 w-4", config.iconClassName, className)} />;
    }

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
            {priorityLabels[priority]}
        </Badge>
    );
}
