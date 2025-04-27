"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { handleSignIn, handleSignOut } from '@/app/actions/auth';
import SignOut from "@/components/auth/SignOut";
import SignIn from "@/components/auth/SignIn"; 
import { useSession } from "@/providers/logto-session-provider";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
    const { isAuthenticated } = useSession();
    const { theme } = useTheme();

    const navigationLinks = [
        { href: '/', label: 'Home' },
        { href: '/nurse', label: 'Nurse Practitioners' },
        { href: '/physician', label: 'Physician Collaborators' },
        ...(isAuthenticated ? [{ href: '/np', label: 'Dashboard' }] : []),
    ];

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="logo relative group">
                    <Image
                        src={theme === 'dark' ? '/logo.png' : '/logo-black.png'}
                        alt="NP Collaborator Logo"
                        width={180}
                        height={32}
                        priority
                        className="w-auto h-8 transition-transform group-hover:scale-105"
                    />
                </Link>

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    {navigationLinks.map(({ href, label }) => (
                        <Link 
                            key={href}
                            href={href} 
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline decoration-primary decoration-2 underline-offset-4"
                        >
                            {label}
                        </Link>
                    ))}
                    {isAuthenticated ? (
                        <SignOut onSignOut={handleSignOut} />
                    ) : (
                        <SignIn onSignIn={handleSignIn} />
                    )}
                    <ThemeToggle /> 
                </nav>
            </div>
        </header>
    );
}