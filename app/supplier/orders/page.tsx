"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import SupplierLayout from "@/components/supplier-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import OrderTrackingMap from "@/components/order-tracking-map"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Order as OrderType } from "@/lib/db" // Import OrderType from lib/db

// Dummy data for map coordinates (replace with actual data from backend if available)
const dummyMapCoords = {
  "GO-001": {
    origin: [28.6139, 77.209], // Delhi
    destination: [28.5355, 77.391], // Noida
    currentLocation: [28.58, 77.3], // Somewhere in between
  },
  "GO-002": {
    origin: [19.076, 72.8777], // Mumbai
    destination: [18.5204, 73.8567], // Pune
    currentLocation: [18.8, 73.5],
  },
  // Add more dummy coordinates for other orders as needed
}

export default function SupplierOrdersPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const [orders, setOrders] = useState<OrderType[]>([])
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const { toast } = useToast()

  const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (user && user.id && user.role === "Supplier") {
      setCurrentSupplierId(user.id)
      fetchOrders(user.id)
    } else {
      toast({
        title: "Authentication Error",
        description: "Please log in as a supplier to manage orders.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [])

  const fetchOrders = async (supplierId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data: OrderType[] = await response.json()
        // Filter orders by the current supplier
        setOrders(data.filter((order) => order.supplierId === supplierId))
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Error",
        description: "Could not connect to the server to fetch orders.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderType["status"]) => {
    setIsUpdatingStatus(true)
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      const data = await response.json()
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
        )
        toast({
          title: "Order Status Updated!",
          description: `Order ${orderId} is now ${newStatus}.`,
        })
      } else {
        toast({
          title: "Status Update Failed",
          description: data.message || "Something went wrong.",
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
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getStatusBadgeVariant = (status: OrderType["status"]) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Accepted":
        return "default"
      case "Rejected":
        return "destructive"
      case "In Progress": // Using In Progress for Preparing/Out for Delivery
        return "outline"
      case "Completed": // Using Completed for Delivered
        return "success"
      default:
        return "secondary"
    }
  }

  const handleTrackDelivery = (order: OrderType) => {
    setSelectedOrder(order)
    setIsMapOpen(true)
  }

  if (isLoading) {
    return (
      <SupplierLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading incoming orders...</span>
        </div>
      </SupplierLayout>
    )
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Incoming Orders</h1>
          <p className="text-gray-600">Manage new group orders from vendors.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Requests</CardTitle>
            <CardDescription>Review and respond to incoming order requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No incoming orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.item}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.vendor}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === "Pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusChange(order.id, "In Progress")} // Changed to In Progress
                              disabled={isUpdatingStatus}
                            >
                              {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(order.id, "Cancelled")} // Changed to Cancelled
                              className="bg-transparent"
                              disabled={isUpdatingStatus}
                            >
                              {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Reject
                            </Button>
                          </div>
                        )}
                        {order.status === "In Progress" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusChange(order.id, "Shipped")} // Changed to Shipped
                              disabled={isUpdatingStatus}
                            >
                              {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Mark as Shipped
                            </Button>
                          </div>
                        )}
                        {order.status === "Shipped" && (
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-transparent"
                                  onClick={() => handleTrackDelivery(order)}
                                >
                                  Track Delivery
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Track Order {order.id}</DialogTitle>
                                </DialogHeader>
                                {selectedOrder && dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords] && (
                                  <div className="h-[400px] w-full">
                                    {mounted && (<OrderTrackingMap
                                      origin={dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].origin}
                                      destination={
                                        dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].destination
                                      }
                                      currentLocation={
                                        dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].currentLocation
                                      }
                                      orderId={selectedOrder.id}
                                    />)}
                                  </div>
                                )}
                                {selectedOrder && !dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords] && (
                                  <div className="flex-1 flex items-center justify-center text-gray-500 h-[400px]">
                                    Map data not available for this order.
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusChange(order.id, "Completed")} // Changed to Completed
                              disabled={isUpdatingStatus}
                            >
                              {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Mark as Delivered
                            </Button>
                          </div>
                        )}
                        {order.status === "Completed" && <Badge variant="success">Delivered</Badge>}
                        {order.status === "Cancelled" && <Badge variant="destructive">Rejected</Badge>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Order Tracking Map Dialog (for supplier) */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-3xl w-full h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Track Order: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Status:{" "}
              <Badge variant={getStatusBadgeVariant(selectedOrder?.status || "Pending")}>{selectedOrder?.status}</Badge>
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords] && (
            <div className="flex-1">
              {mounted && (<OrderTrackingMap
                origin={dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].origin}
                destination={dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].destination}
                currentLocation={dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].currentLocation}
                orderId={selectedOrder.id}
              />)}
            </div>
          )}
          {selectedOrder && !dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords] && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Map data not available for this order.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SupplierLayout>
  )
}