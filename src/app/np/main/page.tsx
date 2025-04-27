import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";

interface TimelineItem {
    title: string;
    description: string;
    status?: 'completed' | 'current' | 'upcoming';
}

const timeline: TimelineItem[] = [
    {
        title: "Your Profile Is Live",
        description: "Once your profile and credentials are validated, calendar synced, and agreement is signed, your profile will be live for our algorithms to make available for matching to NP's and PA's.",
        status: 'current'
    },
    {
        title: "NP Match",
        description: "When an NP joins our service, they create a profile of their practice and collaborating needs. Our matching algorithms will provide a minimum of 3 physicians that match their criteria.",
        status: 'upcoming'
    },
    {
        title: "NP Compares Matches",
        description: "The NP will review the physician profiles to learn more about them and compare monthly rates.",
        status: 'upcoming'
    },
    {
        title: "Video Intro",
        description: "The NP will select 1-2 physicians for a video call to assess compatibility. After the call, both parties can decide whether to proceed with the collaboration.",
        status: 'upcoming'
    },
    {
        title: "Finalize Credentials",
        description: "Upon mutual approval, you'll be asked to submit remaining credentials. If your profile was already complete and validated beforehand, expect a faster path to finalizing the collaborative agreement.",
        status: 'upcoming'
    },
    {
        title: "Collaboration Agreement",
        description: "You and the NP will each sign the Collaboration Agreement. This agreement outlines the terms of the collaboration, including payment structure, collaboration scope, and expectations.",
        status: 'upcoming'
    },
    {
        title: "Collaboration Begins!",
        description: "You'll be launched into our collaboration portal with built in monthly attestation, and payment hub.",
        status: 'upcoming'
    },
    {
        title: "Ongoing Support",
        description: "Our commitment doesn&apos;t end with the match. We provide ongoing collaboration supports, addressing any issues or questions that arise.",
        status: 'upcoming'
    },
]

export default function NPMainPage() {
    return (
        <div className="bg-background min-h-screen w-full">
            <AppHeader />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="rounded-lg border bg-success/10 p-4 text-success-foreground mb-8">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <h3 className="font-medium">Information</h3>
                                </div>
                            </div>
                            <div className="mt-2 text-sm">
                                Your profile is currently in review. You will be notified within 2 business days when your profile has been approved.
                            </div>
                        </div>
                        <div className="rounded-lg border bg-primary/10 p-4 text-primary-foreground mb-8">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <h3 className="font-medium">Current Status</h3>
                                </div>
                                {/* <p className="text-primary font-medium">
                                    {user.submissionStatus}
                                </p> */}
                            </div>
                            <div className="mt-2 text-sm">
                                Last updated: {new Date().toLocaleDateString()}
                            </div>
                        </div>

                        <div className="mb-8 bg-card rounded-lg shadow-sm border p-6">
                            <h2 className="text-2xl font-bold mb-6 text-foreground">What happens next?</h2>
                            <Button asChild className="mb-8 w-full sm:w-auto">
                                <Link href="/np/agreement">Sign Your Agreement</Link>
                            </Button>
                            <p className="text-muted-foreground">
                                After approval, you will receive an email that links you to the agreement you&apos;ll need to sign before
                                your profile is active on NP Collaborator. The email will also give you instructions on how to
                                connect your calendar.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 relative">
                        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-primary/20" role="presentation" />

                        {timeline.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-start group ${
                                    item.status === 'completed' ? 'opacity-75' : 
                                    item.status === 'current' ? 'opacity-100' : 
                                    'opacity-50'
                                }`}
                                role="listitem"
                                aria-label={`Timeline step ${index + 1}: ${item.title}`}
                            >
                                <div className="relative">
                                    <div
                                        className={`absolute left-3 top-[0.875rem] w-3 h-3 bg-background border-[3px] ${
                                            item.status === 'completed' ? 'border-success' :
                                            item.status === 'current' ? 'border-primary' :
                                            'border-muted'
                                        } rounded-full z-10 shadow-sm transition-all duration-300 group-hover:scale-110`}
                                        role="presentation"
                                    />
                                </div>
                                <div className="flex-1 ml-12">
                                    <div className="bg-card/50 rounded-xl hover:bg-card transition-all duration-300 p-4">
                                        {item.status === 'current' && (
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                                                Current Step
                                            </span>
                                        )}
                                        <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
