"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logo-white.png' : '/logo-black.png';

  return (
    <footer className="bg-secondary text-foreground py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Logo and Newsletter Section */}
        <div className="flex justify-between items-start mb-16">
          <div className="max-w-md">
            <Image 
              src={logoSrc}
              alt="NP Collaborator" 
              width={0} 
              height={0} 
              sizes="100vw" 
              className="w-auto h-auto mb-4" 
            />
            <p className="text-lg text-muted-foreground">
              Let Doctors compete for your Nurse Practitioner collaboration requirement.
            </p>
          </div>

          <div className="text-right">
            <h3 className="text-xl mb-4">Subscribe to our newsletter</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="px-4 py-2 rounded bg-muted text-foreground"
              />
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Directory, Professionals, and Contact Sections */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-4">Page Directory</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Professionals</h3>
            <ul className="space-y-2">
              <li><Link href="/nurse-practitioners" className="text-muted-foreground hover:text-foreground">Nurse Practitioners</Link></li>
              <li><Link href="/physicians" className="text-muted-foreground hover:text-foreground">Physicians</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="mb-2 text-muted-foreground">support@npcollaborator.com</p>
            <p className="text-muted-foreground">7901 4TH ST. N STE 300</p>
            <p className="text-muted-foreground">St. Petersburg, FL 33702</p>
          </div>
        </div>

        {/* Copyright and Social Links */}
        <div className="flex justify-between items-center pt-8 border-t border-muted">
          <p className="text-muted-foreground">Copyright © NP Collaborator</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:opacity-80">
              <Image src="/instagram-icon.svg" alt="Instagram" className="w-6 h-6" width={30} height={30} />
            </Link>
            <Link href="/" className="hover:opacity-80">
              <Image src="/twitter-icon.svg" alt="Twitter" className="w-6 h-6" width={30} height={30} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}