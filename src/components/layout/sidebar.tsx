"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Ticket,
    PlusCircle,
    BookOpen,
    Settings,
    Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Create Ticket", href: "/create", icon: PlusCircle },
    { name: "Knowledge Base", href: "/knowledge", icon: BookOpen },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-50 flex w-16 lg:w-64 flex-col border-r bg-background transition-all duration-300">
                {/* Logo */}
                <div className="flex h-16 items-center justify-center lg:justify-start lg:px-6 border-b">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Headphones className="h-4 w-4" />
                        </div>
                        <span className="hidden lg:block font-bold text-lg">
                            IT Help Desk
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-2 lg:p-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Tooltip key={item.name} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-center lg:justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4 flex-shrink-0" />
                                        <span className="hidden lg:block">{item.name}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="lg:hidden">
                                    {item.name}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Settings at bottom */}
                <div className="p-2 lg:p-4 border-t">
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Link
                                href="#"
                                className="flex items-center justify-center lg:justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
                            >
                                <Settings className="h-5 w-5 flex-shrink-0" />
                                <span className="hidden lg:block">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="lg:hidden">
                            Settings
                        </TooltipContent>
                    </Tooltip>
                </div>
            </aside>
        </TooltipProvider>
    );
}
