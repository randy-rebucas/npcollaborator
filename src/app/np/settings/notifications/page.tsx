'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface INotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationTypes: {
        [key: string]: boolean;
    }
}

// Add type for main toggle settings
type MainToggleType = 'emailNotifications' | 'pushNotifications';
// Add type for notification types
type NotificationTypeKey = keyof INotificationSettings['notificationTypes'] & string;

export default function NotificationsPage() {
    const [settings, setSettings] = useState<INotificationSettings>({
        emailNotifications: false,
        pushNotifications: false,
        notificationTypes: {
            'new-messages': false,
            'mentions': false,
            'updates': false,
            'security-alerts': false
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [updatingSettings, setUpdatingSettings] = useState<string[]>([]);


    // Fetch initial settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings/notifications');
                const data = await response.json();
                console.log(data);
                setSettings(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load notification settings");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleToggle = async (type: MainToggleType) => {
        setUpdatingSettings(prev => [...prev, type]);

        setSettings(prev => ({
            ...prev,
            [type]: !prev[type]
        }));

        try {
            const response = await fetch('/api/settings/notifications', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    value: !settings[type]
                }),
            });

            if (!response.ok) throw new Error('Failed to update setting');

            toast.success("Settings updated successfully");
        } catch (error) {
            console.error(error);
            setSettings(prev => ({
                ...prev,
                [type]: !prev[type]
            }));

            toast.error("Failed to update setting");
        } finally {
            setUpdatingSettings(prev => prev.filter(t => t !== type));
        }
    };

    const handleTypeToggle = async (type: NotificationTypeKey) => {
        setUpdatingSettings(prev => [...prev, type]);

        setSettings(prev => ({
            ...prev,
            notificationTypes: {
                ...prev.notificationTypes,
                [type]: !prev.notificationTypes[type]
            }
        }));

        try {
            const response = await fetch('/api/settings/notifications/types', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    value: !settings.notificationTypes[type]
                }),
            });

            if (!response.ok) throw new Error('Failed to update notification type');

            toast.success("Notification type updated successfully");
        } catch (error) {
            console.error(error);
            setSettings(prev => ({
                ...prev,
                notificationTypes: {
                    ...prev.notificationTypes,
                    [type]: !prev.notificationTypes[type]
                }
            }));

            toast.error("Failed to update notification type");
        } finally {
            setUpdatingSettings(prev => prev.filter(t => t !== type));
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Notification Preferences Section */}
            <div className="border rounded-lg p-6 bg-card">
                <h2 className="text-lg font-medium mb-4 text-foreground">Notification Preferences</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-medium text-foreground">Email Notifications</label>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.emailNotifications}
                                onChange={() => handleToggle('emailNotifications')}
                                disabled={updatingSettings.includes('emailNotifications')}
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer 
                                        peer-checked:after:translate-x-full peer-checked:bg-primary 
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                        after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all">
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-medium text-foreground">Push Notifications</label>
                            <p className="text-sm text-muted-foreground">Receive push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.pushNotifications}
                                onChange={() => handleToggle('pushNotifications')}
                                disabled={updatingSettings.includes('pushNotifications')}
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer 
                                        peer-checked:after:translate-x-full peer-checked:bg-primary 
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                        after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all">
                            </div>
                        </label>
                    </div>
                </div>
            </div>
            <div className="border rounded-lg p-6 bg-card">
                <h2 className="text-lg font-medium mb-4 text-foreground">Notification Types</h2>
                <div className="space-y-4">
                    {[
                        { id: 'new-messages' as const, label: 'New Messages' },
                        { id: 'mentions' as const, label: 'Mentions' },
                        { id: 'updates' as const, label: 'Updates' },
                        { id: 'security-alerts' as const, label: 'Security Alerts' }
                    ].map(({ id, label }) => (
                        <div key={id} className="flex items-start">
                            <input
                                type="checkbox"
                                id={id}
                                checked={settings.notificationTypes[id]}
                                onChange={() => handleTypeToggle(id)}
                                disabled={updatingSettings.includes(id)}
                                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor={id} className="ml-3">
                                <div className="font-medium text-foreground">{label}</div>
                                <p className="text-sm text-muted-foreground">
                                    Receive notifications for {id.toLowerCase()}
                                </p>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
