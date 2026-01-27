import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    HelpCircle,
    MessageCircle,
    FileText,
    Mail,
    Phone,
    ExternalLink,
    BookOpen
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Get Help</h1>
                <p className="text-muted-foreground">
                    Find answers to your questions and get support.
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Knowledge Base */}
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Knowledge Base</CardTitle>
                        </div>
                        <CardDescription>
                            Browse our collection of helpful articles and guides.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/knowledge">
                                Browse Articles
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Submit a Ticket */}
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Submit a Ticket</CardTitle>
                        </div>
                        <CardDescription>
                            Can&apos;t find what you&apos;re looking for? Create a support ticket.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/create">
                                Create Ticket
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* FAQs */}
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>FAQs</CardTitle>
                        </div>
                        <CardDescription>
                            Quick answers to commonly asked questions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="border-b pb-2">
                            <p className="font-medium text-sm">How do I reset my password?</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Go to Settings → Security → Change Password.
                            </p>
                        </div>
                        <div className="border-b pb-2">
                            <p className="font-medium text-sm">How long until my ticket is resolved?</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Response times vary based on priority. Critical tickets are addressed within 1 hour.
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-sm">Can I track my ticket status?</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Yes! View all your tickets in the Tickets section.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Contact Support</CardTitle>
                        </div>
                        <CardDescription>
                            Reach out to our support team directly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>support@company.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Support hours: Monday - Friday, 9 AM - 6 PM EST
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Documentation */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Documentation</CardTitle>
                    </div>
                    <CardDescription>
                        Learn how to use the IT Help Desk system effectively.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                            <h4 className="font-medium">Getting Started</h4>
                            <p className="text-sm text-muted-foreground">
                                Learn the basics of creating and managing tickets.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-medium">Best Practices</h4>
                            <p className="text-sm text-muted-foreground">
                                Tips for effective ticket management and communication.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-medium">Advanced Features</h4>
                            <p className="text-sm text-muted-foreground">
                                Explore automation, reporting, and integrations.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
