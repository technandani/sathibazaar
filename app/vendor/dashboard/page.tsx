"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, TrendingDown, Plus, MapPin } from "lucide-react"
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    item: "Green Chili",
    currentVendors: 4,
    targetVendors: 8,
    currentPrice: "₹70/kg",
    originalPrice: "₹85/kg",
    discount: "17%",
    timeLeft: "3h 0m",
    location: "Dwarka",
    image: "/placeholder.svg?height=100&width=100",
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
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Rajesh!</h1>
          <p className="opacity-90">Ready to save money on your raw materials today?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month Savings</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,450</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
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
              <Button className="bg-green-600 hover:bg-green-700 shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Start New Order
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGroupOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="relative h-32 w-full bg-gray-100">
                  <Image
                    src={order.image || "/placeholder.svg"}
                    alt={order.item}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                    {order.discount} OFF
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{order.item}</CardTitle>
                  <CardDescription className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {order.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Price:</span>
                    <div className="text-right">
                      <span className="font-semibold text-green-600 text-lg">{order.currentPrice}</span>
                      <span className="text-sm text-gray-400 line-through ml-2">{order.originalPrice}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vendors:</span>
                    <span className="text-sm font-medium">
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
                    <span className="text-sm font-medium text-orange-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {order.timeLeft}
                    </span>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 shadow-md"
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
