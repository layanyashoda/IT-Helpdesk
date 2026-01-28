"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Ticket,
    PlusCircle,
    BookOpen,
    Settings,
    HelpCircle,
    Search,
    BarChart3,
    Command,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CommandItem {
    id: string
    title: string
    icon: React.ElementType
    href?: string
    action?: () => void
    shortcut?: string
    group: "navigation" | "actions"
}

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const router = useRouter()

    const commands: CommandItem[] = [
        // Navigation
        { id: "dashboard", title: "Go to Dashboard", icon: LayoutDashboard, href: "/", group: "navigation" },
        { id: "tickets", title: "Go to Tickets", icon: Ticket, href: "/tickets", group: "navigation" },
        { id: "create", title: "Create New Ticket", icon: PlusCircle, href: "/create", group: "navigation", shortcut: "N" },
        { id: "knowledge", title: "Knowledge Base", icon: BookOpen, href: "/knowledge", group: "navigation" },
        { id: "analytics", title: "Analytics", icon: BarChart3, href: "/analytics", group: "navigation" },
        { id: "settings", title: "Settings", icon: Settings, href: "/settings", group: "navigation" },
        { id: "help", title: "Get Help", icon: HelpCircle, href: "/help", group: "navigation" },
        { id: "search", title: "Search", icon: Search, href: "/search", group: "navigation" },
    ]

    const filteredCommands = React.useMemo(() => {
        if (!search) return commands
        return commands.filter((cmd) =>
            cmd.title.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, commands])

    const groupedCommands = React.useMemo(() => {
        const groups: Record<string, CommandItem[]> = {
            navigation: [],
            actions: [],
        }
        filteredCommands.forEach((cmd) => {
            groups[cmd.group].push(cmd)
        })
        return groups
    }, [filteredCommands])

    // Keyboard shortcut to open
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // Handle keyboard navigation
    React.useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedIndex((i) => Math.max(i - 1, 0))
            } else if (e.key === "Enter") {
                e.preventDefault()
                const selected = filteredCommands[selectedIndex]
                if (selected) {
                    executeCommand(selected)
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [open, selectedIndex, filteredCommands])

    // Reset selection when search changes
    React.useEffect(() => {
        setSelectedIndex(0)
    }, [search])

    const executeCommand = (cmd: CommandItem) => {
        setOpen(false)
        setSearch("")
        if (cmd.href) {
            router.push(cmd.href)
        } else if (cmd.action) {
            cmd.action()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="overflow-hidden p-0 shadow-lg max-w-lg"
                showCloseButton={false}
            >
                <DialogTitle className="sr-only">Command Palette</DialogTitle>
                <div className="flex items-center border-b px-3">
                    <Command className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    />
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        ESC
                    </kbd>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {filteredCommands.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No results found.
                        </p>
                    ) : (
                        <>
                            {groupedCommands.navigation.length > 0 && (
                                <div className="mb-2">
                                    <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                        Navigation
                                    </p>
                                    {groupedCommands.navigation.map((cmd, index) => {
                                        const globalIndex = filteredCommands.indexOf(cmd)
                                        return (
                                            <button
                                                key={cmd.id}
                                                onClick={() => executeCommand(cmd)}
                                                className={cn(
                                                    "relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors",
                                                    globalIndex === selectedIndex
                                                        ? "bg-accent text-accent-foreground"
                                                        : "hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <cmd.icon className="mr-3 h-4 w-4" />
                                                <span>{cmd.title}</span>
                                                {cmd.shortcut && (
                                                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                                        {cmd.shortcut}
                                                    </kbd>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                            {groupedCommands.actions.length > 0 && (
                                <div>
                                    <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                        Actions
                                    </p>
                                    {groupedCommands.actions.map((cmd) => {
                                        const globalIndex = filteredCommands.indexOf(cmd)
                                        return (
                                            <button
                                                key={cmd.id}
                                                onClick={() => executeCommand(cmd)}
                                                className={cn(
                                                    "relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors",
                                                    globalIndex === selectedIndex
                                                        ? "bg-accent text-accent-foreground"
                                                        : "hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <cmd.icon className="mr-3 h-4 w-4" />
                                                <span>{cmd.title}</span>
                                                {cmd.shortcut && (
                                                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                                        {cmd.shortcut}
                                                    </kbd>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="flex items-center justify-between border-t px-3 py-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Navigate with</span>
                        <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">↑</kbd>
                        <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">↓</kbd>
                        <span>Select with</span>
                        <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">↵</kbd>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px]">Ctrl</kbd>
                        <span className="mx-1">+</span>
                        <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px]">K</kbd>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
