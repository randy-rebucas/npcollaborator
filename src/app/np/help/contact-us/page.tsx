import Link from "next/link";

export default function ContactUsPage() {
    return (
        <div className="max-w-2xl mx-auto">
  
            {/* Contact Section */}
            <div className="bg-card p-6 space-y-6 rounded-lg border">
                <div className="border-b border-border pb-4">
                    <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
                    <p className="text-muted-foreground mt-1">Need Help or Have Feedback?</p>
                </div>

                <div className="space-y-4">
                    {/* Contact Card */}
                    <Link 
                        href="/np/help/contact" 
                        className="group flex items-center justify-between p-4 rounded-xl border border-border 
                                 hover:border-primary transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/10"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Contact us</h3>
                            <p className="text-muted-foreground">Can ask us for any help</p>
                        </div>
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-2xl shadow-sm">
                            @
                        </div>
                    </Link>

                    {/* Report Issue Card */}
                    <Link 
                        href="/np/help/report" 
                        className="group flex items-center justify-between p-4 rounded-xl border border-border 
                                 hover:border-destructive transition-all cursor-pointer hover:shadow-lg hover:shadow-destructive/10"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Report an issue</h3>
                            <p className="text-muted-foreground">Let us know of any bug</p>
                        </div>
                        <div className="w-12 h-12 bg-destructive rounded-xl flex items-center justify-center text-destructive-foreground text-2xl shadow-sm">
                            🐞
                        </div>
                    </Link>

                    {/* Feature Request Card */}
                    <Link 
                        href="/np/help/feature" 
                        className="group flex items-center justify-between p-4 rounded-xl border border-border 
                                 hover:border-success transition-all cursor-pointer hover:shadow-lg hover:shadow-success/10"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Request a feature</h3>
                            <p className="text-muted-foreground">Tell us about new features</p>
                        </div>
                        <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center text-success-foreground font-bold shadow-sm">
                            NEW
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}