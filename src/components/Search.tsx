'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex-1">
            <input
                defaultValue={searchParams.get('query')?.toString()}
                onChange={(event) => {
                    handleSearch(event.target.value);
                }}
                type="text"
                placeholder={placeholder}
                className="w-64 border border-border rounded-lg px-4 py-2 
                           focus:outline-none focus:ring-2 focus:ring-primary bg-background 
                           text-foreground transition-all"
            />
        </div>
    );
}