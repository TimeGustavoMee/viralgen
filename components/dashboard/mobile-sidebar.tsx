"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Home, MessageSquare, Settings, CreditCard, HelpCircle, Heart } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { useMobile } from "@/hooks/use-mobile"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  // Close sidebar when pathname changes (navigation occurs)
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!isMobile) {
    return null
  }

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Make Viral with AI", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px] sm:w-[350px]">
        <DashboardSidebar />
      </SheetContent>
    </Sheet>
  )
}
