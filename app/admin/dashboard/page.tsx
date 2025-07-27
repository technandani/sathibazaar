"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShoppingBag, Users, AlertTriangle, TrendingUp, Loader2 } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [openComplaints, setOpenComplaints] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate fetching data from API routes
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch Users
        const usersResponse = await fetch("/api/users")
        const usersData = await usersResponse.json()
        setTotalUsers(usersData.length)

        // Fetch Orders
        const ordersResponse = await fetch("/api/orders")
        const ordersData = await ordersResponse.json()
        setTotalOrders(ordersData.length)
        const revenue = ordersData.reduce((sum: number, order: any) => {
          const amount = Number.parseFloat(order.totalAmount.replace("₹", "").replace(",", "")) || 0
          return sum + amount
        }, 0)
        setTotalRevenue(revenue)

        // Fetch Complaints
        const complaintsResponse = await fetch("/api/complaints")
        const complaintsData = await complaintsResponse.json()
        setOpenComplaints(complaintsData.filter((c: any) => c.status === "Open").length)

        toast({
          title: "Dashboard Data Loaded",
          description: "Latest statistics are now available.",
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        toast({
          title: "Error",
          description: "Could not load dashboard data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading dashboard data...</span>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered on platform</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Group orders placed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openComplaints}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From completed orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Charts (Placeholder) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>Latest registrations and logins.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                {/* In a real app, fetch recent user activity */}
                No recent activity to display.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Trends</CardTitle>
              <CardDescription>Monthly order volume and value.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                {/* In a real app, integrate a chart library */}
                No order trends to display.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}