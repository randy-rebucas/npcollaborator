'use client';

// import { Notifications } from "@/components/Notifications";
import { HelpMenu } from "@/components/HelpMenu";
import Search from "@/components/Search";
import Profile from "@/components/Profile";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
interface HeaderProps {
  showSearch?: boolean;
}

export default function AppHeader({ showSearch = false }: HeaderProps) {
  return (
    <header className="w-full top-0 z-50 bg-background/90 border-b border-border shadow-sm backdrop-blur-md">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/np">
              <Image 
                src="/logo-black.png"
                className="dark:hidden"
                alt="Logo" 
                width={100} 
                height={100} 
              />
              <Image 
                src="/logo-white.png"
                className="hidden dark:block"
                alt="Logo" 
                width={100} 
                height={100} 
              />
            </Link>
            {showSearch && (
              <Search placeholder="Search for a match" /> 
            )}
          </div>
          <div className="flex items-center gap-6">
            <HelpMenu />
            <ThemeToggle /> 
            {/* <Notifications /> */}
            <Profile /> 
          </div>
        </div>
      </nav>
    </header>
  );
}