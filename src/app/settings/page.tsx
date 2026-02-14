"use client";

// Force rebuild

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Mail, Shield, User, Palette } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        newTicket: true,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNotificationChange = (key: keyof typeof notifications) => (checked: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: checked }));
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Separator />

            <div className="grid gap-6">
                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Appearance</CardTitle>
                        </div>
                        <CardDescription>
                            Customize how the application looks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Toggle between light and dark themes.
                                </p>
                            </div>
                            <Switch
                                checked={theme === "dark"}
                                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>
                            Choose what notifications you receive.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email updates for ticket changes.
                                </p>
                            </div>
                            <Switch
                                checked={notifications.email}
                                onCheckedChange={handleNotificationChange('email')}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive push notifications in the browser.
                                </p>
                            </div>
                            <Switch
                                checked={notifications.push}
                                onCheckedChange={handleNotificationChange('push')}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>New Ticket Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when new tickets are created.
                                </p>
                            </div>
                            <Switch
                                checked={notifications.newTicket}
                                onCheckedChange={handleNotificationChange('newTicket')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Account */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Account</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your account information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Admin User</p>
                                <p className="text-sm text-muted-foreground">admin@company.com</p>
                            </div>
                            <Button variant="outline" size="sm">Edit Profile</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your security preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to your account.
                                </p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Change Password</Label>
                                <p className="text-sm text-muted-foreground">
                                    Update your password regularly for security.
                                </p>
                            </div>
                            <Button variant="outline" size="sm">Change</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
