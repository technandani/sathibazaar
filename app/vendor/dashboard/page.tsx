"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, TrendingDown, Plus, Loader2 } from "lucide-react"
import VendorLayout from "@/components/vendor-layout"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import type { orders } from "@/lib/db" // Import simulated data

export default function VendorDashboard() {
  const { toast } = useToast()
  const [activeOrdersCount, setActiveOrdersCount] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [activeGroupOrders, setActiveGroupOrders] = useState<any[]>([]) // Use 'any' for simplicity with dummy data
  const [isLoading, setIsLoading] = useState(true)

  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null)
  const [currentVendorName, setCurrentVendorName] = useState<string | null>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (user && user.id && user.role === "Vendor") {
      setCurrentVendorId(user.id)
      setCurrentVendorName(user.name)
      fetchDashboardData(user.id)
    } else {
      toast({
        title: "Authentication Error",
        description: "Please log in as a vendor to view your dashboard.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [])

  const fetchDashboardData = async (vendorId: string) => {
    setIsLoading(true)
    try {
      // Fetch Orders
      const ordersResponse = await fetch("/api/orders")
      const allOrdersData: typeof orders = await ordersResponse.json()
      const vendorOrders = allOrdersData.filter((order) => order.vendorId === vendorId)

      const activeOrders = vendorOrders.filter(
        (order) => order.status === "Pending" || order.status === "In Progress" || order.status === "Shipped",
      )
      setActiveOrdersCount(activeOrders.length)

      // Simulate monthly savings and wallet balance
      setMonthlySavings(2450)
      setWalletBalance(1250)

      // Simulate active group orders (these would typically be fetched from a 'group_orders' collection)
      // For now, we'll use a static list and filter/map it
      const dummyActiveGroupOrders = [
        {
          id: "GO-001",
          item: "Onions",
          currentVendors: 8,
          targetVendors: 15,
          currentPrice: "₹25/kg",
          originalPrice: "₹30/kg",
          discount: "17%",
          timeLeft: "2h 30m",
          location: "Karol Bagh Market",
          supplier: "Suresh Vegetables",
        },
        {
          id: "GO-002",
          item: "Tomatoes",
          currentVendors: 12,
          targetVendors: 20,
          currentPrice: "₹35/kg",
          originalPrice: "₹45/kg",
          discount: "22%",
          timeLeft: "4h 15m",
          location: "Lajpat Nagar",
          supplier: "Fresh Mart",
        },
        {
          id: "GO-003",
          item: "Potatoes",
          currentVendors: 6,
          targetVendors: 10,
          currentPrice: "₹18/kg",
          originalPrice: "₹22/kg",
          discount: "18%",
          timeLeft: "1h 45m",
          location: "Chandni Chowk",
          supplier: "Green Valley Farms",
        },
      ]
      setActiveGroupOrders(dummyActiveGroupOrders)

      toast({
        title: "Dashboard Data Loaded",
        description: "Latest statistics are now available.",
      })
    } catch (error) {
      console.error("Failed to fetch vendor dashboard data:", error)
      toast({
        title: "Error",
        description: "Could not load dashboard data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinOrder = (orderItem: string) => {
    toast({
      title: "Order Joined Successfully!",
      description: `You have joined the ${orderItem} group order.`,
    })
    // In a real app, this would trigger an API call to join the order
  }

  if (isLoading) {
    return (
      <VendorLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <span className="ml-2 text-lg">Loading dashboard data...</span>
        </div>
      </VendorLayout>
    )
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {currentVendorName || "Rajesh"}!</h1>
          <p className="opacity-90">Ready to save money on your raw materials today?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrdersCount}</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month Savings</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{monthlySavings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{walletBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available balance</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Group Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Nearby Active Group Orders</h2>
            <Link href="/vendor/start-order">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Start New Order
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGroupOrders.length === 0 ? (
              <p className="text-gray-500 col-span-full">No active group orders found.</p>
            ) : (
              activeGroupOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{order.item}</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {order.discount} OFF
                      </Badge>
                    </div>
                    <CardDescription>{order.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Price:</span>
                      <div className="text-right">
                        <span className="font-semibold text-green-600">{order.currentPrice}</span>
                        <span className="text-sm text-gray-400 line-through ml-2">{order.originalPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Vendors:</span>
                      <span className="text-sm">
                        {order.currentVendors}/{order.targetVendors}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(order.currentVendors / order.targetVendors) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Left:</span>
                      <span className="text-sm font-medium text-orange-600">{order.timeLeft}</span>
                    </div>

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleJoinOrder(order.item)}
                    >
                      Join Order
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </VendorLayout>
  )
}
