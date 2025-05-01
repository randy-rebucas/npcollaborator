import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar"

import AdminSidebarFooterUser from "@/components/SidebarFooterUser"

import MenuItems from "./MenuItems"
import { SidebarHeaderContent } from "./SidebarHeaderContent"

export async function AdminSidebar() {

    // Menu items.
    const items = [
        {
            title: "Dashboard",
            url: "/admin",
            icon: "dashboard",
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: "users",
        },
        {
            title: "Memberstack Members",
            url: "/admin/memberstack",
            icon: "users",
        },
        {
            title: "Memberstack Webhooks",
            url: "/admin/webhook",
            icon: "users",
        },
        {
            title: "Event Log",
            url: "/admin/event-log",
            icon: "list",
        },
        {
            title: "Enquiries",
            url: "/admin/enquiries",
            icon: "faq",
        },
        {
            title: "Features",
            url: "/admin/features",
            icon: "help",
        },
        {
            title: "Issues",
            url: "/admin/issues",
            icon: "help",
        },
        {
            title: "Listings",
            url: "/admin/listings",
            icon: "listings",
        },
        {
            title: "Offers",
            url: "/admin/offers",
            icon: "offers",
        },
        {
            title: "Email Notifications",
            url: "/admin/notifications",
            icon: "notifications",
        },
        {
            title: "Templates",
            url: "/admin/templates",
            icon: "templates",
        },
        {
            title: "Roles",
            url: "/admin/roles",
            icon: "roles",
        },
        {
            title: "Permissions",
            url: "/admin/permissions",
            icon: "permissions",
        },
        {
            title: "License States",
            url: "/admin/license-states",
            icon: "miscellaneous",
        },
        {
            title: "Practice Types",
            url: "/admin/practice-types",
            icon: "miscellaneous",
        },
        {
            title: "Settings",
            url: "/admin/settings",
            icon: "settings",
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarHeaderContent />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <MenuItems items={items} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <AdminSidebarFooterUser />
            </SidebarFooter>
        </Sidebar>
    )
}
