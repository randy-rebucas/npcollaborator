'use client';

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import Nav from "@/components/Nav"
import { useSession } from "@/providers/logto-session-provider";
import { useState } from "react";
import { IUser } from "@/models/User";
import { getUser } from "@/app/actions/user";
import { useEffect } from "react";

export function AppSidebar() {
    const { claims } = useSession();
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                if (!claims.sub) return;
                const userData = await getUser(claims.sub);
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // Optionally show an error toast/message to user
            }
        };
        getUserData();
    }, [claims.sub]);

    const userFullName = user?.profile 
        ? `${user.profile.familyName} ${user.profile.givenName}`.trim()
        : "Loading...";

    return (
        <aside className="flex h-screen w-72 flex-col bg-card/50 backdrop-blur-xl border-r border-border">
            {/* Header */}
            <div className="p-6 flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar || ""} alt={userFullName} />
                    <AvatarFallback className="rounded-lg">
                        {user?.profile?.familyName?.charAt(0) || "?"}
                    </AvatarFallback>
                </Avatar>   
                <div className="min-w-0">
                    <div className="truncate font-semibold text-sm text-foreground">
                        {userFullName}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                        {user?.primaryEmail || "Loading..."}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <Nav/>
        </aside>
    )
}
