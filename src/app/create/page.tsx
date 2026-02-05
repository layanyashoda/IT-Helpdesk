"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, Paperclip, X, FileIcon, BookOpen, Check, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addTicket, generateTicketId } from "@/lib/storage";
import { Ticket, TicketPriority, TicketCategory, Attachment } from "@/types";
import { categoryLabels, priorityLabels, mockUsers, mockAgents, mockKnowledgeArticles } from "@/lib/mock-data";

// Combined list of potential approvers (Users + Agents) for the dropdown
const approvers = [...mockUsers, ...mockAgents];

export default function CreateTicketPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        category: "" as TicketCategory | "",
        priority: "medium" as TicketPriority,
        department: "",
        requestType: "" as 'incident' | 'service_request' | 'problem' | 'change_request' | "",
        approverId: "",
    });
    const [attachments, setAttachments] = useState<Attachment[]>([]);
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

        if (!formData.department) {
            newErrors.department = "Please select a department";
        }

        if (!formData.category) {
            newErrors.category = "Please select a category";
        }

        if (!formData.requestType) {
            newErrors.requestType = "Please select a request type";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newAttachments: Attachment[] = [];
        const maxSize = 5 * 1024 * 1024; // 5MB total limit for this prototype

        let currentSize = attachments.reduce((acc, curr) => acc + curr.size, 0);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (currentSize + file.size > maxSize) {
                alert(`File "${file.name}" exceeds the total size limit of 5MB.`);
                continue;
            }

            currentSize += file.size;

            // Convert to Base64
            const base64Url = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

            newAttachments.push({
                id: `att-${Date.now()}-${i}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: base64Url,
            });
        }

        setAttachments((prev) => [...prev, ...newAttachments]);

        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeAttachment = (id: string) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id));
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
            department: formData.department,
            requestType: formData.requestType as 'incident' | 'service_request' | 'problem' | 'change_request',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: mockUsers[0], // Current user (mock)
            assignedTo: undefined,
            approverId: formData.approverId || undefined,
            approvalStatus: formData.approverId ? 'pending' : 'approved', // Auto-approve if no approver selected (optional logic, or force selection?)
            comments: [],
            attachments: attachments,
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
                        {/* Department, Category, Request Type Row */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Department */}
                            <div className="space-y-2">
                                <Label htmlFor="department">
                                    Department <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.department}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, department: value }))
                                    }
                                >
                                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Marketing', 'Sales', 'Engineering', 'HR', 'Finance', 'IT', 'Operations'].map((dept) => (
                                            <SelectItem key={dept} value={dept}>
                                                {dept}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department && (
                                    <p className="text-sm text-red-500">{errors.department}</p>
                                )}
                            </div>

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
                                        <SelectValue placeholder="Select category" />
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

                            {/* Request Type */}
                            <div className="space-y-2">
                                <Label htmlFor="requestType">
                                    Request Type <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.requestType}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, requestType: value as any }))
                                    }
                                >
                                    <SelectTrigger className={errors.requestType ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            { value: 'incident', label: 'Incident' },
                                            { value: 'service_request', label: 'Service Request' },
                                            { value: 'problem', label: 'Problem' },
                                            { value: 'change_request', label: 'Change Request' },
                                        ].map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.requestType && (
                                    <p className="text-sm text-red-500">{errors.requestType}</p>
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
                            </div>
                        </div>

                        {/* Approver Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="approver">
                                Assign Approver (Optional)
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            "w-full justify-between",
                                            !formData.approverId && "text-muted-foreground"
                                        )}
                                    >
                                        {formData.approverId
                                            ? approvers.find((approver) => approver.id === formData.approverId)?.name
                                            : "Select an approver"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search approver..." />
                                        <CommandList>
                                            <CommandEmpty>No approver found.</CommandEmpty>
                                            <CommandGroup>
                                                {approvers.map((approver) => (
                                                    <CommandItem
                                                        value={approver.name}
                                                        key={approver.id}
                                                        onSelect={() => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                approverId: prev.approverId === approver.id ? "" : approver.id
                                                            }))
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                approver.id === formData.approverId
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {approver.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <p className="text-xs text-muted-foreground">
                                If an approver is selected, the ticket will status be 'Pending Approval' until approved.
                            </p>
                        </div>

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

                            {/* Smart Deflection: Suggested Solutions */}
                            {formData.subject.length > 3 && (
                                (() => {
                                    // Simple keyword matching logic
                                    const keywords = formData.subject.toLowerCase().split(" ").filter(w => w.length > 3);
                                    if (keywords.length === 0) return null;

                                    const suggestions = mockKnowledgeArticles.filter(article => {
                                        const title = article.title.toLowerCase();
                                        const tags = article.tags.join(" ").toLowerCase();
                                        return keywords.some(k => title.includes(k) || tags.includes(k));
                                    }).slice(0, 3); // Take top 3

                                    if (suggestions.length === 0) return null;

                                    return (
                                        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 mt-2">
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300">
                                                    <BookOpen className="h-4 w-4" />
                                                    <h4 className="text-sm font-semibold">Suggested Solutions</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {suggestions.map(article => (
                                                        <li key={article.id} className="text-sm">
                                                            <a
                                                                href="/knowledge"
                                                                target="_blank"
                                                                className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors hover:underline"
                                                            >
                                                                <span className="shrink-0 mt-1">•</span>
                                                                <span>{article.title}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="text-xs text-muted-foreground mt-2 pl-3 italic">
                                                    Check these articles before submitting description helps!
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })()
                            )}
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

                        {/* Attachments */}
                        <div className="space-y-3">
                            <Label>Attachments</Label>

                            {/* File List */}
                            {attachments.length > 0 && (
                                <div className="grid gap-2 mb-3">
                                    {attachments.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50 text-sm">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                <span className="truncate">{file.name}</span>
                                                <span className="text-muted-foreground text-xs shrink-0">
                                                    ({(file.size / 1024).toFixed(0)} KB)
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => removeAttachment(file.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*,application/pdf,.txt,.doc,.docx"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Paperclip className="h-4 w-4" />
                                    Attach Files
                                </Button>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Max size: 5MB total. Supported: Images, PDF, Text, Docs.
                                </p>
                            </div>
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
                        <li>Attach screenshots of the error if possible</li>
                        <li>List the steps you&apos;ve already tried</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
