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
import { Home, Users, ShoppingBag, AlertTriangle, BarChart3, ShoppingCart, LogOut, Bell, Settings } from "lucide-react"
import Link from "next/link"

const adminMenuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
  { title: "Complaints", url: "/admin/complaints", icon: AlertTriangle },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="border-r border-gray-200">
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-4 py-2">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            <span className="text-lg font-bold">SathiBazaar</span>
          </div>
          <div className="px-4 py-2 bg-gray-100 rounded-lg mx-4">
            <p className="text-sm font-medium text-gray-800">Admin Panel</p>
            <p className="text-xs text-gray-600">System Administrator</p>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
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
