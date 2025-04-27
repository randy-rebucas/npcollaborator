'use client';
import Link from "next/link";


export default function HelpPage() {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg border">
            <h1 className="text-4xl font-extrabold text-foreground mb-6">Help Center</h1>
            
            {/* Search Bar */}
            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="Search for help..." 
                    className="w-full p-3 bg-background border border-border rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            {/* Links Section */}
            <div className="flex flex-col gap-6 mb-6">
                <Link href="/np/help/faq" className="text-lg font-medium text-primary hover:text-primary/80 transition duration-300">
                    FAQ
                </Link>
                <Link href="/np/help/contactus" className="text-lg font-medium text-primary hover:text-primary/80 transition duration-300">
                    Contact Us
                </Link>
            </div>

            {/* Popular Articles */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Popular Articles</h2>
                <ul className="list-disc list-inside">
                    <li><Link href="/np/help/article1" className="text-primary hover:text-primary/80">How to reset your password</Link></li>
                    <li><Link href="/np/help/article2" className="text-primary hover:text-primary/80">Setting up two-factor authentication</Link></li>
                    <li><Link href="/np/help/article3" className="text-primary hover:text-primary/80">Managing your account settings</Link></li>
                </ul>
            </div>

            {/* Feedback Form */}
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Feedback</h2>
                <form>
                    <textarea 
                        placeholder="Let us know how we can improve..." 
                        className="w-full p-3 bg-background border border-border rounded-lg mb-4
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        rows={4}
                    ></textarea>
                    <button 
                        type="submit" 
                        className="w-full bg-primary text-primary-foreground p-3 rounded-lg 
                                 hover:bg-primary/90 transition duration-300"
                    >
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
}