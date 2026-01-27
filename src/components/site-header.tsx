"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/tickets": "Tickets",
  "/create": "Create Ticket",
  "/knowledge": "Knowledge Base",
  "/dashboard": "Analytics Dashboard",
  "/settings": "Settings",
  "/help": "Get Help",
  "/search": "Search",
}

export function SiteHeader() {
  const pathname = usePathname()

  // Get page title based on pathname
  let title = "IT Help Desk"
  if (pageTitles[pathname]) {
    title = pageTitles[pathname]
  } else if (pathname.startsWith("/tickets/")) {
    title = "Ticket Details"
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
