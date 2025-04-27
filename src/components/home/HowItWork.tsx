'use client';

const processSteps = [
    {
        icon: (
            <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        title: "Sign Up",
        description: "Easy Registration: Create your profile with a few simple steps. Provide your practice details and specific needs."
    },
    {
        icon: (
            <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none">
                <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 12L12 9M12 9L9 12M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
        title: "Instant Matching and Pricing",
        description: "Receive a list of potential collaborating physicians who meet your criteria and an instant cost breakdown."
    },
    {
        icon: (
            <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2" rx="2"/>
                <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
        title: "Choose Your Collaborator",
        description: "Schedule an Interview: Review profiles and choose a time on their calendar for an interview to ensure perfect fit alignment."
    },
    {
        icon: (
            <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
        title: "Start Collaborating",
        description: "Begin Partnership: Sign a customized contract and access our dashboard for billing, compliance, and communication."
    }
];

export default function HowItWork() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col items-center mb-12">
                <button className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-4">
                    How It Works
                </button>
                
                <h2 className="text-3xl font-bold text-center text-foreground">
                    Our Simple Process:
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, index) => (
                    <div 
                        key={index}
                        className="bg-card p-6 rounded-2xl flex flex-col items-center text-center border border-border"
                    >
                        <div className="mb-4 text-primary">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-foreground">
                            {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-12">
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center">
                    Match With an MD Now
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

