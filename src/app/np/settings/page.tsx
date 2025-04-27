import Link from "next/link";

export default function Settings() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
                {/* Profile Section */}
                <section className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Profile</h2>
                    <div className="space-y-2">
                        <Link href="/np/settings/profile" className="block p-3 hover:bg-gray-50 rounded-md transition-colors">
                            <div className="font-medium">Personal Information</div>
                            <div className="text-sm text-gray-500">Update your name, email, and profile picture</div>
                        </Link>
                        <Link href="/np/settings/password" className="block p-3 hover:bg-gray-50 rounded-md transition-colors">
                            <div className="font-medium">Password & Security</div>
                            <div className="text-sm text-gray-500">Change your password and security settings</div>
                        </Link>
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                    <div className="space-y-2">
                        <Link href="/np/settings/notifications" className="block p-3 hover:bg-gray-50 rounded-md transition-colors">
                            <div className="font-medium">Notifications</div>
                            <div className="text-sm text-gray-500">Manage your notification preferences</div>
                        </Link>
                        <Link href="/np/settings/appearance" className="block p-3 hover:bg-gray-50 rounded-md transition-colors">
                            <div className="font-medium">Appearance</div>
                            <div className="text-sm text-gray-500">Customize your display settings</div>
                        </Link>
                    </div>
                </section>

                {/* Account Section */}
                <section className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Account</h2>
                    <div className="space-y-2">
                        <Link href="/np/settings/billing" className="block p-3 hover:bg-gray-50 rounded-md transition-colors">
                            <div className="font-medium">Billing & Subscription</div>
                            <div className="text-sm text-gray-500">Manage your subscription and payment methods</div>
                        </Link>
                        <Link href="/np/settings/data" className="block p-3 hover:bg-gray-50 rounded-md transition-colors text-red-600 hover:bg-red-50">
                            <div className="font-medium">Data & Privacy</div>
                            <div className="text-sm text-red-500">Download or delete your account data</div>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
