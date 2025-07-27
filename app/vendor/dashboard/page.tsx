"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, TrendingDown, Plus } from "lucide-react"
import VendorLayout from "@/components/vendor-layout"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

const activeGroupOrders = [
  {
    id: 1,
    item: "Onions",
    currentVendors: 8,
    targetVendors: 15,
    currentPrice: "₹25/kg",
    originalPrice: "₹30/kg",
    discount: "17%",
    timeLeft: "2h 30m",
    location: "Karol Bagh Market",
  },
  {
    id: 2,
    item: "Tomatoes",
    currentVendors: 12,
    targetVendors: 20,
    currentPrice: "₹35/kg",
    originalPrice: "₹45/kg",
    discount: "22%",
    timeLeft: "4h 15m",
    location: "Lajpat Nagar",
  },
  {
    id: 3,
    item: "Potatoes",
    currentVendors: 6,
    targetVendors: 10,
    currentPrice: "₹18/kg",
    originalPrice: "₹22/kg",
    discount: "18%",
    timeLeft: "1h 45m",
    location: "Chandni Chowk",
  },
]

export default function VendorDashboard() {
  const { toast } = useToast()

  const handleJoinOrder = (orderItem: string) => {
    toast({
      title: "Order Joined Successfully!",
      description: `You have joined the ${orderItem} group order.`,
    })
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Rajesh!</h1>
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
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month Savings</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,450</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,250</div>
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
            {activeGroupOrders.map((order) => (
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
            ))}
          </div>
        </div>
      </div>
    </VendorLayout>
  )
}
