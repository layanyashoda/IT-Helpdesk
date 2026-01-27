"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addTicket, generateTicketId } from "@/lib/storage";
import { Ticket, TicketPriority, TicketCategory } from "@/types";
import { categoryLabels, priorityLabels, mockUsers, mockAgents } from "@/lib/mock-data";

export default function CreateTicketPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        category: "" as TicketCategory | "",
        priority: "medium" as TicketPriority,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        } else if (formData.subject.length < 5) {
            newErrors.subject = "Subject must be at least 5 characters";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.length < 20) {
            newErrors.description = "Please provide more details (at least 20 characters)";
        }

        if (!formData.category) {
            newErrors.category = "Please select a category";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newTicket: Ticket = {
            id: generateTicketId(),
            subject: formData.subject.trim(),
            description: formData.description.trim(),
            status: "open",
            priority: formData.priority,
            category: formData.category as TicketCategory,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: mockUsers[0], // Current user (mock)
            assignedTo: undefined, // Auto-assignment could be added here
            comments: [],
        };

        addTicket(newTicket);
        router.push(`/tickets/${newTicket.id}`);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Back Button */}
            <Link href="/">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </Link>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Create New Ticket</CardTitle>
                    <CardDescription>
                        Submit a new IT support request. Please provide as much detail as possible.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Subject */}
                        <div className="space-y-2">
                            <Label htmlFor="subject">
                                Subject <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="subject"
                                placeholder="Brief summary of your issue"
                                value={formData.subject}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                                }
                                className={errors.subject ? "border-red-500" : ""}
                            />
                            {errors.subject && (
                                <p className="text-sm text-red-500">{errors.subject}</p>
                            )}
                        </div>

                        {/* Category & Priority Row */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, category: value as TicketCategory }))
                                    }
                                >
                                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(categoryLabels).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-500">{errors.category}</p>
                                )}
                            </div>

                            {/* Priority */}
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, priority: value as TicketPriority }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(priorityLabels).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Select based on urgency and business impact
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you have already tried."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                rows={6}
                                className={`resize-none ${errors.description ? "border-red-500" : ""}`}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {formData.description.length} / 20+ characters recommended
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4">
                            <Link href="/">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit Ticket
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-muted/50 border-0">
                <CardContent className="pt-6">
                    <h3 className="font-semibold text-sm mb-2">Tips for faster resolution:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Include specific error messages or codes</li>
                        <li>Describe when the issue started</li>
                        <li>Mention any recent changes to your system</li>
                        <li>List the steps you&apos;ve already tried</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
