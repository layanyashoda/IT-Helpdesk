"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Headphones,

  Ticket,
  PlusCircle,
  BookOpen,
  Settings,
  HelpCircle,
  Search,
  BarChart3,
  UserCheck,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@company.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Create Ticket",
      url: "/create",
      icon: PlusCircle,
    },
    {
      title: "Tickets",
      url: "/tickets",
      icon: Ticket,
    },
    {
      title: "Knowledge Base",
      url: "/knowledge",
      icon: BookOpen,
    },
  ],
  navMyWork: [
    {
      title: "Assigned to Me",
      url: "/my-tickets",
      icon: UserCheck,
    },
    {
      title: "My Approvals",
      url: "/approvals",
      icon: UserCheck,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Headphones className="h-5 w-5" />
                <span className="text-base font-semibold">IT Help Desk</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label="Platform" />
        <NavMain items={data.navMyWork} label="My Work" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
