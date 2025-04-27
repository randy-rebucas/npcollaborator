'use client';

import Image from "next/image";

export default function AboutUs() {
    return (
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-16">
            {/* Left side - Image */}
            <div className="w-1/2">
                <div className="bg-warning rounded-3xl">
                    <Image 
                        src="https://cdn.prod.website-files.com/668ac3475fa3479b9cfb7893/668ada7c2f605adb1dd7f20f_With%20LapTop%20-%20Left%20-%20Resized%20-%20Transparent.png" 
                        alt="Nurse practitioner with laptop" 
                        className="rounded-2xl"
                        width={500}
                        height={400}
                    />
                </div>
            </div>

            {/* Right side - Content */}
            <div className="w-1/2 pl-16">
                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
                    About us
                </div>

                <h1 className="text-4xl font-bold mb-6 text-foreground">
                    For Nurse Practitioners, by Nurse Practitioners
                </h1>

                <p className="text-muted-foreground mb-12">
                    With us, physicians compete for your business, ensuring you receive the best support at a fair price.
                </p>

                {/* Features */}
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="p-1 bg-primary/10 rounded-full">
                            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Instant Matching:</h3>
                            <p className="text-muted-foreground">Get paired with a collaborating physician instantly, so you can start your practice without delay.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-1 bg-primary/10 rounded-full">
                            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Significant Savings:</h3>
                            <p className="text-muted-foreground">Our service is 30% more affordable than competitors, providing you with top-tier support at a lower cost.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-1 bg-primary/10 rounded-full">
                            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">Comprehensive Support:</h3>
                            <p className="text-muted-foreground">From legal agreements and included physician malpractice insurance, we handle it all, ensuring you are fully compliant with state regulations.</p>
                        </div>
                    </div>
                </div>

                <button className="mt-12 px-6 py-3 bg-background border-2 border-border rounded-full font-semibold hover:bg-muted transition-colors">
                    See Available Physicians
                </button>
            </div>
        </div>
    );
}