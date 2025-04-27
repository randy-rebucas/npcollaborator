'use client';

// import Image from "next/image";

export default function Brand() {
    return (
        <div className="w-full bg-background py-12 border-y border-border">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-foreground">
                            Founder featured on <span className="text-warning">Media</span>
                        </h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-80">
                            {/* <Image 
                                src="https://cdn.prod.website-files.com/668ac3475fa3479b9cfb7893/668ada7c2f605adb1dd7f20f_Forbes%20-%20Logo%20-%20Transparent.png" 
                                alt="Forbes" 
                                width={120} 
                                height={40} 
                                className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
                            />
                            <Image 
                                src="https://cdn.prod.website-files.com/668ac3475fa3479b9cfb7893/668ada7c2f605adb1dd7f20f_Boston%20Business%20Journal%20-%20Logo%20-%20Transparent.png" 
                                alt="Boston Business Journal" 
                                width={200} 
                                height={40} 
                                className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
                            />
                            <Image 
                                src="https://cdn.prod.website-files.com/668ac3475fa3479b9cfb7893/668ada7c2f605adb1dd7f20f_Strequry%20-%20Logo%20-%20Transparent.png" 
                                alt="Strequry" 
                                width={140} 
                                height={40} 
                                className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
                            /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}