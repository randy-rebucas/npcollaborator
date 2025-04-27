'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/providers/logto-session-provider";

export default function FooterUser() {
    const { claims } = useSession();
    
    const getTimeAgo = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        
        return 'just now';
    };

    const username = claims?.username?.toString() || "Guest";
    const avatarUrl = claims?.avatar?.toString() || "/default-avatar.png";

    return (
        <>
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback className="rounded-lg bg-muted-foreground/10">
                    {username.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">{username}</span>
                <span className="truncate text-xs text-muted-foreground">
                    {getTimeAgo(claims?.created_at?.toString()) || 'No join date'}
                </span>
            </div>
        </>
    );
}


