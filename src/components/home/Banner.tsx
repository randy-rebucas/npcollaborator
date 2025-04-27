'use client';

import Image from "next/image";
import Link from "next/link";

export default function Banner() {
    return (
        <div className="bg-background relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-primary/5" />
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[300px] h-[300px] rounded-full bg-secondary/5" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left content */}
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                                <span className="text-primary text-sm font-medium">Now Available in Florida</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                Find Your Perfect <span className="text-primary">Collaboration</span> Match
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Streamline your practice with our intelligent matching system. Connect with qualified physicians or nurse practitioners in minutes, not months.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href="/signup"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                            >
                                Get Started Now
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link 
                                href="/how-it-works"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                How It Works
                            </Link>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-foreground">500+</span>
                                <span className="text-sm text-muted-foreground">Active Matches</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-foreground">48h</span>
                                <span className="text-sm text-muted-foreground">Average Match Time</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-foreground">4.9/5</span>
                                <span className="text-sm text-muted-foreground">User Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="flex-1 relative">
                        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-primary/10 to-transparent p-2">
                            <Image 
                                src="/doctor-image.png" 
                                alt="Medical professionals collaborating" 
                                width={400} 
                                height={300}
                                className="rounded-xl w-full h-auto object-cover"
                                priority
                            />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}