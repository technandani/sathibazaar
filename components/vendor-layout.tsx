"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Users, UserPlus, Wallet, History, HelpCircle, ShoppingCart, LogOut, Bell } from "lucide-react"
import Link from "next/link"

const vendorMenuItems = [
  { title: "Dashboard", url: "/vendor/dashboard", icon: Home },
  { title: "Start Group Order", url: "/vendor/start-order", icon: UserPlus },
  { title: "Join Order", url: "/vendor/join-order", icon: Users },
  { title: "Wallet", url: "/vendor/wallet", icon: Wallet },
  { title: "Order History", url: "/vendor/history", icon: History },
  { title: "Help", url: "/vendor/help", icon: HelpCircle },
]

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="border-r border-green-200">
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-4 py-2">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold">SathiBazaar</span>
          </div>
          <div className="px-4 py-2 bg-green-50 rounded-lg mx-4">
            <p className="text-sm font-medium text-green-800">Vendor Panel</p>
            <p className="text-xs text-green-600">Rajesh Kumar</p>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {vendorMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
