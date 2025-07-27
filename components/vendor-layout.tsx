"use client"

import type React from "react"

import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  Menu,
  ShoppingCart,
  Users,
  Wallet,
  History,
  HelpCircle,
  Plus,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en") // Default language

  const translations: { [key: string]: { [key: string]: string } } = {
    en: {
      dashboard: "Dashboard",
      startOrder: "Start New Order",
      joinOrder: "Join Group Order",
      myOrders: "My Orders", // New translation
      wallet: "Wallet",
      orderHistory: "Order History",
      help: "Help & Support",
      settings: "Settings",
      logout: "Logout",
      selectLanguage: "Select Language",
      english: "English",
      hindi: "Hindi",
    },
    hi: {
      dashboard: "डैशबोर्ड",
      startOrder: "नया ऑर्डर शुरू करें",
      joinOrder: "ग्रुप ऑर्डर में शामिल हों",
      myOrders: "मेरे ऑर्डर", // New translation
      wallet: "वॉलेट",
      orderHistory: "ऑर्डर इतिहास",
      help: "सहायता और समर्थन",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",
      selectLanguage: "भाषा चुनें",
      english: "अंग्रेज़ी",
      hindi: "हिंदी",
    },
  }

  const t = translations[language]

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ShoppingCart className="h-6 w-6" />
              <span className="">SathiBazaar</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8 bg-transparent">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/vendor/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                {t.dashboard}
              </Link>
              <Link
                href="/vendor/start-order"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                {t.startOrder}
              </Link>
              <Link
                href="/vendor/join-order"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                {t.joinOrder}
              </Link>
              <Link
                href="/vendor/my-orders" // New link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                {t.myOrders}
              </Link>
              <Link
                href="/vendor/wallet"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Wallet className="h-4 w-4" />
                {t.wallet}
              </Link>
              <Link
                href="/vendor/history"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <History className="h-4 w-4" />
                {t.orderHistory}
              </Link>
              <Link
                href="/vendor/help"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <HelpCircle className="h-4 w-4" />
                {t.help}
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>{t.selectLanguage}</CardTitle>
                <CardDescription>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t.selectLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t.english}</SelectItem>
                      <SelectItem value="hi">{t.hindi}</SelectItem>
                    </SelectContent>
                  </Select>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="sr-only">SathiBazaar</span>
                </Link>
                <Link
                  href="/vendor/dashboard"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  {t.dashboard}
                </Link>
                <Link
                  href="/vendor/start-order"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-5 w-5" />
                  {t.startOrder}
                </Link>
                <Link
                  href="/vendor/join-order"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  {t.joinOrder}
                </Link>
                <Link
                  href="/vendor/my-orders" // New link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  {t.myOrders}
                </Link>
                <Link
                  href="/vendor/wallet"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Wallet className="h-5 w-5" />
                  {t.wallet}
                </Link>
                <Link
                  href="/vendor/history"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <History className="h-5 w-5" />
                  {t.orderHistory}
                </Link>
                <Link
                  href="/vendor/help"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <HelpCircle className="h-5 w-5" />
                  {t.help}
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle>{t.selectLanguage}</CardTitle>
                    <CardDescription>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t.selectLanguage} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">{t.english}</SelectItem>
                          <SelectItem value="hi">{t.hindi}</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">{/* Search or other header content can go here */}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t.settings}</DropdownMenuItem>
              <DropdownMenuItem>{t.help}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t.logout}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
