'use client';

import Image from "next/image";

export default function Matching() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-6 flex-1">
                    <h1 className="text-4xl font-bold text-warning">
                        Available Now: Ready-to-Match Physicians
                    </h1>
                    <p className="text-lg text-foreground">
                        View and match instantly with qualified collaborating physicians.
                    </p>

                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-foreground">All rates include:</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center text-foreground">
                                <span className="text-success mr-2">✓</span>
                                Physician Malpractice Coverage
                            </li>
                            <li className="flex items-center text-foreground">
                                <span className="text-success mr-2">✓</span>
                                Legal Documents
                            </li>
                            <li className="flex items-center text-foreground">
                                <span className="text-success mr-2">✓</span>
                                Compliance Support
                            </li>
                            <li className="flex items-center text-foreground">
                                <span className="text-success mr-2">✓</span>
                                24/7 Platform Access
                            </li>
                        </ul>
                    </div>

                    <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center">
                        Search Physicians
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Right Column - Physician Cards */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* You can create a separate PhysicianCard component for these */}
                    {/* This is just a placeholder for the physician cards shown in the image */}
                    <div className="bg-card p-4 rounded-lg shadow-md border border-border">
                        <Image
                            src="https://cdn.prod.website-files.com/668ac3475fa3479b9cfb7893/677431faf8656133cd1fcb5c_Screenshot%202024-12-31%20130312-p-500.png"
                            alt="Matching"
                            className="rounded-2xl"
                            sizes="100vw"
                            width={800}
                            height={600}
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
