'use client'

import { useParams } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Suspense } from "react";

export default function UserLayout({ children, detail, modal }: { children: React.ReactNode, detail: React.ReactNode, modal: React.ReactNode }) {
    const { id } = useParams<{ id: string }>()

    if (id) {
        return (
            <div className="flex gap-4 p-4">
                <ErrorBoundary>
                    <div className="flex-1 space-y-4">
                        <Suspense fallback={<LoadingSpinner />}>
                            {children}
                        </Suspense>
                    </div>

                    <div className="w-1/3 px-2 border-l">
                        <Suspense fallback={<LoadingSpinner />}>
                            {detail}
                        </Suspense>
                    </div>
                    {modal}
                </ErrorBoundary>
            </div>
        );
    } else {
        return (
            <ErrorBoundary>
                <div className="mx-auto space-y-4 w-full">
                    <Suspense fallback={<LoadingSpinner />}>
                        {children}
                    </Suspense>
                </div>
            </ErrorBoundary>
        );
    }
}