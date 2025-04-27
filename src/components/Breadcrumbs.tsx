import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
    label: string;
    href: string;
    active?: boolean;
}

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
    return (
        <ol className="flex items-center">
            {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.label} className="flex items-center last:mr-0">
                    {breadcrumb.active ? (
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                            {breadcrumb.label}
                        </span>
                    ) : (
                        <>
                            <Link
                                href={breadcrumb.href}
                                className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all duration-200 hover:scale-105"
                            >
                                {breadcrumb.label}
                            </Link>
                            {index < breadcrumbs.length - 1 && (
                                <ChevronRight className="h-3.5 w-3.5 mx-2 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                            )}
                        </>
                    )}
                </li>
            ))}
        </ol>
    );
}