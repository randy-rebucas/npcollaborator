"use client";

import { useRouter } from "next/navigation";

export default function NotAuthorized() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8 max-w-md">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-destructive mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-8">
                        Sorry, you don&apos;t have permission to access this page. Please contact your administrator if you believe this is a mistake.
                    </p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    ← Go Back
                </button>
            </div>
        </div>
    );
}