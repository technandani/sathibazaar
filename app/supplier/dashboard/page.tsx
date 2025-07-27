"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, TrendingUp, Clock, Star, Package, Users, Loader2 } from "lucide-react"
import SupplierLayout from "@/components/supplier-layout"
import { useToast } from "@/components/ui/use-toast"
import type { orders, users } from "@/lib/db" // Import simulated data
import type { OrderType } from "@/types/order" // Import OrderType

export default function SupplierDashboard() {
  const [todayOrdersCount, setTodayOrdersCount] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [activeVendorsCount, setActiveVendorsCount] = useState(0)
  const [supplierRating, setSupplierRating] = useState(0)
  const [todayOrders, setTodayOrders] = useState<any[]>([]) // Use 'any' for simplicity with dummy data
  const [mostRequested, setMostRequested] = useState<any[]>([]) // Use 'any' for simplicity with dummy data
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null)
  const [currentSupplierName, setCurrentSupplierName] = useState<string | null>(null) // Declare currentSupplierName

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (user && user.id && user.role === "Supplier") {
      setCurrentSupplierId(user.id)
      setCurrentSupplierName(user.name) // Set currentSupplierName
      fetchDashboardData(user.id)
    } else {
      toast({
        title: "Authentication Error",
        description: "Please log in as a supplier to view your dashboard.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [])

  const fetchDashboardData = async (supplierId: string) => {
    setIsLoading(true)
    try {
      // Fetch Orders
      const ordersResponse = await fetch("/api/orders")
      const allOrdersData: typeof orders = await ordersResponse.json()
      const supplierOrders = allOrdersData.filter((order) => order.supplierId === supplierId)

      const today = new Date().toISOString().split("T")[0]
      const ordersToday = supplierOrders.filter((order) => order.date === today)
      setTodayOrdersCount(ordersToday.length)
      setTodayOrders(
        ordersToday.map((order) => ({
          id: order.id,
          item: order.item,
          quantity: order.quantity,
          vendors: 0, // Placeholder, actual vendor count per order not in current data
          area: "N/A", // Placeholder
          status: order.status.toLowerCase(),
        })),
      )

      const revenue = supplierOrders.reduce((sum, order) => {
        const amount = Number.parseFloat(order.totalAmount.replace("₹", "").replace(",", "")) || 0
        return sum + amount
      }, 0)
      setTotalRevenue(revenue)

      // Fetch Users (to count active vendors)
      const usersResponse = await fetch("/api/users")
      const allUsersData: typeof users = await usersResponse.json()
      const activeVendors = allUsersData.filter((user) => user.role === "Vendor" && user.status === "Active").length
      setActiveVendorsCount(activeVendors)

      // Simulate rating (in a real app, this would be calculated from reviews)
      setSupplierRating(4.8)

      // Simulate most requested items (in a real app, this would be aggregated from order data)
      const productRequests: { [key: string]: number } = {}
      supplierOrders.forEach((order) => {
        productRequests[order.item] = (productRequests[order.item] || 0) + 1
      })
      const sortedRequested = Object.entries(productRequests)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 4)
        .map(([item, requests]) => ({
          item,
          requests,
          trend: "+X%", // Placeholder for trend
        }))
      setMostRequested(sortedRequested)

      toast({
        title: "Dashboard Data Loaded",
        description: "Latest statistics are now available.",
      })
    } catch (error) {
      console.error("Failed to fetch supplier dashboard data:", error)
      toast({
        title: "Error",
        description: "Could not load dashboard data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderType["status"]) => {
    // This function is already implemented in app/supplier/orders/page.tsx
    // For dashboard, we'll just simulate the update and re-fetch
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      if (response.ok) {
        toast({
          title: "Order Status Updated!",
          description: `Order ${orderId} is now ${newStatus}.`,
        })
        if (currentSupplierId) {
          fetchDashboardData(currentSupplierId) // Re-fetch dashboard data
        }
      } else {
        const errorData = await response.json()
        toast({
          title: "Status Update Failed",
          description: errorData.message || "Something went wrong.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Order status update error:", error)
      toast({
        title: "Error",
        description: "Could not connect to the server to update status.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <SupplierLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading dashboard data...</span>
        </div>
      </SupplierLayout>
    )
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {currentSupplierName || "Supplier"}!</h1>
          <p className="opacity-90">You have {todayOrdersCount} new group orders waiting for your response.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayOrdersCount}</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p> {/* Placeholder */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20% from last week</p> {/* Placeholder */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeVendorsCount}</div>
              <p className="text-xs text-muted-foreground">Ordering today</p> {/* Placeholder */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supplierRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Based on 156 reviews</p> {/* Placeholder */}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Group Orders</CardTitle>
              <CardDescription>Orders requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayOrders.length === 0 ? (
                  <p className="text-gray-500">No orders for today.</p>
                ) : (
                  todayOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{order.item}</span>
                          <Badge
                            variant={
                              order.status === "pending"
                                ? "secondary"
                                : order.status === "accepted" || order.status === "in progress"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.quantity} • {order.vendors} vendors • {order.area}
                        </p>
                      </div>
                      {order.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, "Cancelled")}>
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleStatusChange(order.id, "In Progress")}
                          >
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Most Requested Items */}
          <Card>
            <CardHeader>
              <CardTitle>Most Requested Items</CardTitle>
              <CardDescription>Popular items this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mostRequested.length === 0 ? (
                  <p className="text-gray-500">No requested items data.</p>
                ) : (
                  mostRequested.map((item, index) => (
                    <div key={item.item} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-sm text-gray-600">{item.requests} requests</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {item.trend}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 bg-blue-600 hover:bg-blue-700">
                <div className="text-center">
                  <Package className="h-6 w-6 mx-auto mb-2" />
                  <span>Add New Product</span>
                </div>
              </Button>
              <Button variant="outline" className="h-20 bg-transparent">
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2" />
                  <span>Update Delivery Schedule</span>
                </div>
              </Button>
              <Button variant="outline" className="h-20 bg-transparent">
                <div className="text-center">
                  <Star className="h-6 w-6 mx-auto mb-2" />
                  <span>View Reviews</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  )
}
