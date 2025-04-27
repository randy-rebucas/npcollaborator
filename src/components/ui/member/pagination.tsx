'use client'

import { Button } from "@/components/ui/button"

export default function Pagination({
    startItem,
    endItem,
    totalItems,
    currentPage,
    query,
    totalPages,
}: {
    startItem: number;
    endItem: number;
    totalItems: number;
    currentPage: number;
    query: string;
    totalPages: number;
}) {
    return (
        
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {startItem} to {endItem} of {totalItems} entries
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => window.location.href = `?page=${currentPage - 1}&query=${query}`}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => window.location.href = `?page=${currentPage + 1}&query=${query}`}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}