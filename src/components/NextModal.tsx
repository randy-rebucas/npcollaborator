'use client';

import { useRouter } from "next/navigation";

export default function NextModal({ children, className = 'max-w-3xl' }: { children: React.ReactNode, className?: string }) {
    const router = useRouter();

    return (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50 flex items-center justify-center" onClick={() => router.back()}>
            <div className={`bg-white dark:bg-gray-800 mx-4 rounded-lg w-full ${className}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
} 