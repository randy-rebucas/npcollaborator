"use client"

import { LayoutDashboard, Settings, Users, List, HelpCircle, Info, Hash, ArrowLeftRight, TicketPercent, Bell, File, Key, ShieldCheck } from "lucide-react"
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const iconMap: { [key: string]: React.ElementType } = {
    dashboard: LayoutDashboard,
    users: Users,
    members: Users,
    transactions: ArrowLeftRight,
    list: List,
    faq: Info,
    help: HelpCircle,
    miscellaneous: Hash,
    settings: Settings,
    listings: List,
    offers: TicketPercent,
    notifications: Bell,
    templates: File,
    roles: Key,
    permissions: ShieldCheck,
};

interface MenuItem {
    title: string;
    url: string;
    icon: string;
}

export default function MenuItems({ items }: { items: MenuItem[] }) {
    const pathname = usePathname();

    return (
        <SidebarMenu>
            {items.map((item) => {
                const IconComponent = iconMap[item.icon] || DefaultIcon;
                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={pathname === item.url}>
                            <Link href={item.url}>
                                <IconComponent />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    )
}

const DefaultIcon = () => <span>Icon</span>;