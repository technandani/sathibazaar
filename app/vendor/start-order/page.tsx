"use client"

import { useState, useEffect } from "react"
import VendorLayout from "@/components/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import OrderTrackingMap from "@/components/order-tracking-map"
import ReviewModal from "@/components/review-modal"
import { Package, MapPin, Star, Eye, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import type { Order as OrderType } from "@/lib/db" // Import OrderType from lib/db

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled"

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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (user && user.id && user.role === "Vendor") {
      setCurrentVendorId(user.id)
      fetchOrders(user.id)
    } else {
      toast({
        title: "Authentication Error",
        description: "Please log in as a vendor to view your orders.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [])

  const fetchOrders = async (vendorId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data: OrderType[] = await response.json()
        // Filter orders by the current vendor
        setOrders(data.filter((order) => order.vendorId === vendorId))
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

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return "secondary"
      case "Shipped":
        return "default"
      case "Delivered":
        return "success" // Assuming 'success' variant exists or can be styled
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleTrackOrder = (order: OrderType) => {
    setSelectedOrder(order)
    setIsMapOpen(true)
  }

  const handleGiveReview = (order: OrderType) => {
    setSelectedOrder(order)
    setIsReviewModalOpen(true)
  }

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (selectedOrder) {
      // Simulate updating the order as reviewed in the backend
      try {
        const response = await fetch("/api/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedOrder.id, reviewed: true, review: { rating, comment } }), // Add review data
        })
        if (response.ok) {
          setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === selectedOrder.id ? { ...order, reviewed: true } : order)),
          )
          toast({
            title: "Review Submitted!",
            description: `Thank you for reviewing order ${selectedOrder.id}. Rating: ${rating} stars.`,
          })
          setIsReviewModalOpen(false)
          setSelectedOrder(null)
        } else {
          const errorData = await response.json()
          toast({
            title: "Review Submission Failed",
            description: errorData.message || "Could not submit review.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Review submission error:", error)
        toast({
          title: "Error",
          description: "Could not connect to the server to submit review.",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewDetails = (order: OrderType) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  if (isLoading) {
    return (
      <VendorLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <span className="ml-2 text-lg">Loading your orders...</span>
        </div>
      </VendorLayout>
    )
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track your group orders and provide feedback to suppliers.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order History
            </CardTitle>
            <CardDescription>A list of all your past and current orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-500">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.item}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.date}</TableCell>{" "}
                        {/* Assuming delivery date is same as order date for simplicity */}
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {order.status !== "Cancelled" && (
                            <div className="flex items-center gap-2">
                              {/* Progress is simulated, not from backend */}
                              <Progress
                                value={order.status === "Delivered" ? 100 : order.status === "Shipped" ? 75 : 25}
                                className="w-[100px]"
                              />
                              <span className="text-sm text-gray-600">
                                {order.status === "Delivered" ? 100 : order.status === "Shipped" ? 75 : 25}%
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {(order.status === "Shipped" || order.status === "Processing") && (
                              <Button variant="outline" size="sm" onClick={() => handleTrackOrder(order)}>
                                <MapPin className="h-4 w-4 mr-1" />
                                Track Order
                              </Button>
                            )}
                            {order.status === "Delivered" &&
                              !(order as any).reviewed && ( // 'reviewed' is not in OrderType, casting for demo
                                <Button variant="default" size="sm" onClick={() => handleGiveReview(order)}>
                                  <Star className="h-4 w-4 mr-1" />
                                  Give Review
                                </Button>
                              )}
                            {order.status === "Delivered" && (order as any).reviewed && (
                              <Button variant="ghost" size="sm" disabled>
                                <Star className="h-4 w-4 mr-1" />
                                Reviewed
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Tracking Map Dialog */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-3xl w-full h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Track Order: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Status:{" "}
              <Badge variant={getStatusBadgeVariant(selectedOrder?.status || "Processing")}>
                {selectedOrder?.status}
              </Badge>
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords] && (
            <div className="flex-1">
              <OrderTrackingMap
                origin={dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].origin}
                destination={dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].destination}
                currentLocation={dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords].currentLocation}
                orderId={selectedOrder.id}
              />
            </div>
          )}
          {selectedOrder && !dummyMapCoords[selectedOrder.id as keyof typeof dummyMapCoords] && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Map data not available for this order.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Modal Dialog */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Supplier for Order {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Share your experience with {selectedOrder?.supplier}.</DialogDescription>
          </DialogHeader>
          {selectedOrder && <ReviewModal onSubmit={handleReviewSubmit} />}
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Order Details: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Comprehensive information about your order.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Item:</Label>
                <div>{selectedOrder.item}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Quantity:</Label>
                <div>{selectedOrder.quantity}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Supplier:</Label>
                <div>{selectedOrder.supplier}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Order Date:</Label>
                <div>{selectedOrder.date}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Delivery Date:</Label>
                <div>{selectedOrder.date}</div> {/* Assuming delivery date is same as order date for simplicity */}
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Status:</Label>
                <div>
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
                </div>
              </div>
              {selectedOrder.status !== "Cancelled" && (
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Progress:</Label>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={selectedOrder.status === "Delivered" ? 100 : selectedOrder.status === "Shipped" ? 75 : 25}
                      className="w-[150px]"
                    />
                    <span className="text-sm text-gray-600">
                      {selectedOrder.status === "Delivered" ? 100 : selectedOrder.status === "Shipped" ? 75 : 25}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </VendorLayout>
  )
}