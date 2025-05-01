'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { getUser } from '@/app/actions/user';
import { useSession } from "@/providers/logto-session-provider";
import { IUser } from '@/models/User';
import { handleSignOut } from '@/app/actions/auth';

export default function Profile() {
    const { claims } = useSession();
    const [userData, setUserData] = useState<Partial<IUser> | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (claims?.sub) {
                const userData = await getUser(claims.sub);
                setUserData(userData);
            }
        }
        if (claims?.sub) {
            fetchUser();
        }
    }, [claims?.sub]);
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-2"
            >
                {userData?.customData?.profilePhotoPath ? (
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={userData?.customData?.profilePhotoPath} alt={userData?.username} />
                        <AvatarFallback className="rounded-lg">{userData?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                ) : (
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">{userData?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <button
                            onClick={() => handleSignOut()}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}