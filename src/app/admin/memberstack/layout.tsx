'use client'

import { useParams } from "next/navigation";

export default function MembersNodeApiLayout({ children, detail }: { children: React.ReactNode, detail: React.ReactNode }) {
    const { id } = useParams<{ id: string }>()

    if (id) {
        return (
            <div className="flex gap-4 p-4">
                {/* Detail Section - 70% width */}
                <div className="flex-1 space-y-4">
                    {children}
                </div>

                {/* Detail Section - 30% width */}
                <div className="w-1/3 px-2 border-l">
                    {detail}
                </div>
            </div>
        );
    } else {
        return (<div className="mx-auto space-y-4 w-full">{children}</div>);
    }
}