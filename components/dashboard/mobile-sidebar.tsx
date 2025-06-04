"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Menu,
  Home,
  MessageSquare,
  Heart,
  Settings,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();

  // Fecha a sidebar sempre que a rota mudar
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!isMobile) {
    return null;
  }

  // Array de links que aparece no menu
  const links = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "Make Viral with AI",
      href: "/dashboard/chat",
      icon: MessageSquare,
    },
    { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-[280px] sm:w-[350px]">
        {/* Título oculto para acessibilidade */}
        <Dialog.Title>
          <VisuallyHidden>Menu Lateral</VisuallyHidden>
        </Dialog.Title>

        {/* Lista de links do menu */}
        <nav className="flex flex-col pt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center px-4 py-2 mb-1
                  ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}
                  focus:outline-none focus:bg-gray-100
                `}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
