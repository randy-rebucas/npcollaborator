"use client"

import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Chat } from "@/components/chat";
// import { Notifications } from "@/components/notifications";
import { handleSignOut } from '@/app/actions/auth';
import Breadcrumbs from "@/components/Breadcrumbs";
import { ThemeToggle } from "@/components/ThemeToggle";
import SignOut from "@/components/auth/SignOut";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function AdminHeader({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {

  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumbs breadcrumbs={breadcrumbs} /> 

      <div className="flex-1 flex justify-end gap-2">
        <ThemeToggle />
        {/* <Chat />
        <Notifications /> */}
        <SignOut onSignOut={handleSignOut} /> 
      </div>
    </header>
  );
}