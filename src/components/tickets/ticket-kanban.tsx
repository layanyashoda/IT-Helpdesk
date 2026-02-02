"use client";

import { useMemo, useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    useDroppable,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ticket, TicketStatus } from "@/types";
import { TicketCard } from "./ticket-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { statusLabels } from "@/lib/mock-data";

interface TicketKanbanProps {
    tickets: Ticket[];
    onTicketUpdate: (ticketId: string, newStatus: TicketStatus) => void;
}

interface KanbanColumn {
    id: TicketStatus;
    title: string;
}

const columns: KanbanColumn[] = [
    { id: "open", title: "Open" },
    { id: "in_progress", title: "In Progress" },
    { id: "resolved", title: "Resolved" },
    { id: "closed", title: "Closed" },
];

export function TicketKanban({ tickets, onTicketUpdate }: TicketKanbanProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    // Group tickets by status
    const ticketsByStatus = useMemo(() => {
        const acc: Record<TicketStatus, Ticket[]> = {
            open: [],
            in_progress: [],
            resolved: [],
            closed: [],
        };
        tickets.forEach((ticket) => {
            if (acc[ticket.status]) {
                acc[ticket.status].push(ticket);
            }
        });
        return acc;
    }, [tickets]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        // Check if over is a container (column) or an item
        // If over is a ticket card, we need to find its container
        // If over is a column, we drop it there.
        // For simplicity in this implementation, we depend on handleDragEnd to update status
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTicketId = active.id as string;
        const overId = over.id as string;
        const activeTicket = tickets.find((t) => t.id === activeTicketId);

        if (!activeTicket) return;

        // Find the destination column
        let newStatus: TicketStatus | undefined;

        // Check if dropped directly on a column
        if (columns.some((col) => col.id === overId)) {
            newStatus = overId as TicketStatus;
        } else {
            // Check if dropped on another ticket
            const overTicket = tickets.find((t) => t.id === overId);
            if (overTicket) {
                newStatus = overTicket.status;
            }
        }

        if (newStatus && newStatus !== activeTicket.status) {
            onTicketUpdate(activeTicketId, newStatus);
        }
    };

    const activeTicket = activeId ? tickets.find((t) => t.id === activeId) : null;

    return (
        <div className="h-[calc(100vh-220px)] overflow-x-auto pb-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-full gap-4 min-w-[1000px]">
                    {columns.map((column) => (
                        <SortableColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            label={statusLabels[column.id]}
                            tickets={ticketsByStatus[column.id]}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTicket ? (
                        <div className="w-[270px] opacity-80 rotate-2 cursor-grabbing">
                            {/* Match width to column content width (300px - padding) */}
                            <TicketCard ticket={activeTicket} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

interface SortableColumnProps {
    id: TicketStatus;
    title: string;
    label: string;
    tickets: Ticket[];
}

function SortableColumn({ id, title, label, tickets }: SortableColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
        data: {
            type: "Column",
            status: id,
        },
    });

    return (
        <div ref={setNodeRef} className="flex h-full w-[300px] flex-col rounded-lg bg-muted/30 border p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{label}</h3>
                <Badge variant="secondary" className="text-xs">
                    {tickets.length}
                </Badge>
            </div>
            <ScrollArea className="flex-1 -mx-2 px-2 overflow-hidden">
                <SortableContext
                    items={tickets.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-3 pb-4 min-h-[150px]">
                        {tickets.map((ticket) => (
                            <SortableTicket key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </SortableContext>
            </ScrollArea>
        </div>
    );
}

function SortableTicket({ ticket }: { ticket: Ticket }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: ticket.id,
        data: {
            type: "Ticket",
            ticket,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-full touch-none"
            {...attributes}
            {...listeners}
        >
            <TicketCard ticket={ticket} />
        </div>
    );
}
