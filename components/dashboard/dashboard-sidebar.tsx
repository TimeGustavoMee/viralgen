"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Settings, CreditCard, HelpCircle, Crown, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Mascot } from "@/components/mascot"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Make Viral with AI", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ]

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background p-6 sticky top-0 h-screen">
      <nav className="flex flex-col gap-2">
        {links.map((link, index) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

          return (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "justify-start w-full rounded-xl",
                  isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/10 hover:text-primary",
                )}
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-5 w-5" />
                  {link.name}
                </Link>
              </Button>
            </motion.div>
          )
        })}
      </nav>
      <div className="mt-auto pt-4 border-t">
        <motion.div
          className="rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 p-5 border-2 border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-medium text-primary mb-1">Upgrade to Pro</h4>
              <p className="text-sm text-muted-foreground mb-3">Get 10 credits per week and unlock all features.</p>
            </div>
            <Crown className="h-5 w-5 text-secondary" />
          </div>
          <Button
            size="sm"
            className="w-full rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            asChild
          >
            <Link href="/dashboard/billing">Upgrade Now</Link>
          </Button>

          <div className="mt-4">
            <Mascot emotion="excited" message="Go Pro for more ideas!" size="sm" />
          </div>
        </motion.div>
      </div>
    </aside>
  )
}
