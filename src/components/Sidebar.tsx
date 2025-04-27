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
            title: "Members",
            url: "/admin/members",
            icon: "users",
        },
        {
            title: "Event Log",
            url: "/admin/event-log",
            icon: "list",
        },
        {
            title: "FAQ",
            url: "/admin/faq",
            icon: "faq",
        },
        {
            title: "Help",
            url: "/admin/help",
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
            title: "Miscellaneous",
            url: "/admin/miscellaneous",
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
