"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter } from "lucide-react"
import VendorLayout from "@/components/vendor-layout"
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
    minQuantity: 5,
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
    minQuantity: 10,
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
    minQuantity: 3,
  },
  {
    id: 4,
    item: "Ginger",
    currentVendors: 3,
    targetVendors: 8,
    currentPrice: "₹80/kg",
    originalPrice: "₹100/kg",
    discount: "20%",
    timeLeft: "6h 0m",
    location: "Sarojini Nagar",
    minQuantity: 2,
  },
]

export default function JoinOrderPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLocation, setFilterLocation] = useState("")
  const [quantityToJoin, setQuantityToJoin] = useState<number | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const filteredOrders = activeGroupOrders.filter(
    (order) =>
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterLocation === "" || order.location.toLowerCase().includes(filterLocation.toLowerCase())),
  )

  const handleJoinClick = (orderId: number) => {
    setSelectedOrderId(orderId)
    setQuantityToJoin(null) // Reset quantity input
  }

  const handleConfirmJoin = () => {
    if (selectedOrderId !== null && quantityToJoin !== null && quantityToJoin > 0) {
      toast({
        title: "Order Joined Successfully!",
        description: `You have joined the order for ${
          activeGroupOrders.find((o) => o.id === selectedOrderId)?.item
        } with ${quantityToJoin} kg.`,
      })
      setSelectedOrderId(null) // Close dialog
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      })
    }
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Join Group Order</h1>
          <p className="text-gray-600">Find active group orders near you and join to get bulk discounts.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by item name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Filter by location..."
              className="pl-9"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Active Group Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Orders</h2>
          {filteredOrders.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">No active orders found matching your criteria.</Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
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

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleJoinClick(order.id)}
                        >
                          Join Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Join Order for {order.item}</DialogTitle>
                          <DialogDescription>
                            Enter the quantity you wish to order. Minimum quantity is {order.minQuantity} kg.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                              Quantity ({order.item === "Cabbage" ? "piece" : "kg"})
                            </Label>
                            <Input
                              id="quantity"
                              type="number"
                              min={order.minQuantity}
                              value={quantityToJoin || ""}
                              onChange={(e) => setQuantityToJoin(Number.parseInt(e.target.value))}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleConfirmJoin} className="bg-green-600 hover:bg-green-700">
                            Confirm Join
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  )
}