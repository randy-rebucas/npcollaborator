import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
    title: 'Admin Settings',
    description: 'Manage your admin preferences and system settings'
};

export default function AdminSettingsPage() {
    return (
        <div className="container mx-auto py-8 space-y-6">
            
            <div className="grid gap-6">
                <Link href="/admin/settings/application" className="p-6 shadow-md rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
                    <div className="space-y-4">
                        {/* Add your settings form components here */}
                        <p className="text-muted-foreground">Configure general system settings and preferences</p>
                    </div>
                </Link>

                <Link href="/admin/settings/profile" className="p-6 shadow-md rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                    <div className="space-y-4">
                         {/* Add security settings components here */}
                        <p className="text-muted-foreground">Manage security preferences and access controls</p>
                    </div>
                </Link>

                <Link href="/admin/settings/password" className="p-6 shadow-md rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Password Settings</h2>
                    <div className="space-y-4">
                            {/* Add notification settings components here */} 
                        <p className="text-muted-foreground">Configure notification preferences and alerts</p>
                    </div>
                </Link>

                <Link href="/admin/settings/notification" className="p-6 shadow-md rounded-md">  
                    <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                    <div className="space-y-4">
                        {/* Add notification settings components here */}
                        <p className="text-muted-foreground">Configure notification preferences and alerts</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
