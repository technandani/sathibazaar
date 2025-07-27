"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Users, ShoppingCart, Wallet, History, LifeBuoy, Menu, X, Globe, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type VendorLayoutProps = {
  children: ReactNode
}

const translations = {
  en: {
    dashboard: "Dashboard",
    startOrder: "Start New Order",
    joinOrder: "Join Group Order",
    myOrders: "My Orders",
    wallet: "Wallet",
    orderHistory: "Order History",
    help: "Help & Support",
    logout: "Logout",
    language: "Language",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    startOrder: "नया ऑर्डर शुरू करें",
    joinOrder: "ग्रुप ऑर्डर में शामिल हों",
    myOrders: "मेरे ऑर्डर्स",
    wallet: "वॉलेट",
    orderHistory: "ऑर्डर इतिहास",
    help: "सहायता",
    logout: "लॉगआउट",
    language: "भाषा",
  },
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  const pathname = usePathname()
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const t = translations[language]

  const navItems = [
    { href: "/vendor/dashboard", icon: Home, label: t.dashboard },
    { href: "/vendor/start-order", icon: ShoppingCart, label: t.startOrder },
    { href: "/vendor/join-order", icon: Users, label: t.joinOrder },
    { href: "/vendor/my-orders", icon: Truck, label: t.myOrders }, // New My Orders link
    { href: "/vendor/wallet", icon: Wallet, label: t.wallet },
    { href: "/vendor/history", icon: History, label: t.orderHistory },
    { href: "/vendor/help", icon: LifeBuoy, label: t.help },
  ]

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar for Desktop */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/vendor/dashboard" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span className="">SathiBazaar Vendor</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href && "bg-muted text-primary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Globe className="h-4 w-4" />
                  {t.language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hi")}>हिन्दी</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="w-full justify-start gap-2 mt-2">
              <Link href="/vendor/login" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                {t.logout}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header for Mobile */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/vendor/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                  <Package className="h-6 w-6" />
                  <span className="">SathiBazaar Vendor</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                      pathname === item.href && "bg-muted text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-4 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Globe className="h-4 w-4" />
                      {t.language}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("hi")}>हिन्दी</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" className="w-full justify-start gap-2 mt-2">
                  <Link href="/vendor/login" className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {t.logout}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/vendor/dashboard" className="font-semibold">
            SathiBazaar Vendor
          </Link>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
