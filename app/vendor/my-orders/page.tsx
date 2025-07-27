"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { useState } from "react"
import VendorLayout from "@/components/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, Star, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import OrderTrackingMap from "@/components/order-tracking-map"
import ReviewModal from "@/components/review-modal"
import { useToast } from "@/components/ui/use-toast"

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled"

type Order = {
  id: string
  item: string
  quantity: string
  supplier: string
  orderDate: string
  pickupDate: string
  status: OrderStatus
  originCoords: [number, number] // [latitude, longitude]
  destinationCoords: [number, number]
  currentLocationCoords?: [number, number] // Optional, for real-time tracking
  hasReviewed: boolean
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    item: "Onions",
    quantity: "50 kg",
    supplier: "Fresh Veggies Co.",
    orderDate: "2024-07-20",
    pickupDate: "2024-07-22",
    status: "Delivered",
    originCoords: [28.6139, 77.209], // Delhi
    destinationCoords: [28.5355, 77.391], // Noida
    hasReviewed: false,
  },
  {
    id: "ORD-002",
    item: "Tomatoes",
    quantity: "30 kg",
    supplier: "Green Farms",
    orderDate: "2024-07-25",
    pickupDate: "2024-07-27",
    status: "Shipped",
    originCoords: [19.076, 72.8777], // Mumbai
    destinationCoords: [18.5204, 73.8567], // Pune
    currentLocationCoords: [18.7, 73.5], // Simulated current location
    hasReviewed: false,
  },
  {
    id: "ORD-003",
    item: "Potatoes",
    quantity: "100 kg",
    supplier: "Bulk Produce",
    orderDate: "2024-07-26",
    pickupDate: "2024-07-28",
    status: "Processing",
    originCoords: [22.5726, 88.3639], // Kolkata
    destinationCoords: [22.5726, 88.3639], // Same as origin for processing
    hasReviewed: false,
  },
  {
    id: "ORD-004",
    item: "Cabbage",
    quantity: "20 pieces",
    supplier: "Local Harvest",
    orderDate: "2024-07-24",
    pickupDate: "2024-07-26",
    status: "Cancelled",
    originCoords: [12.9716, 77.5946], // Bangalore
    destinationCoords: [12.9716, 77.5946],
    hasReviewed: false,
  },
  {
    id: "ORD-005",
    item: "Ginger",
    quantity: "10 kg",
    supplier: "Spice Route",
    orderDate: "2024-07-27",
    pickupDate: "2024-07-29",
    status: "Shipped",
    originCoords: [26.9124, 75.7873], // Jaipur
    destinationCoords: [26.8, 75.9],
    currentLocationCoords: [26.85, 75.85],
    hasReviewed: false,
  },
]

export default function VendorMyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

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

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsMapOpen(true)
  }

  const handleGiveReview = (order: Order) => {
    setSelectedOrder(order)
    setIsReviewModalOpen(true)
  }

  const handleReviewSubmit = (orderId: string, rating: number, comment: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, hasReviewed: true /* In a real app, send review to backend */ } : order,
      ),
    )
    toast({
      title: "Review Submitted!",
      description: `You rated order ${orderId} with ${rating} stars.`,
    })
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track your active orders and review delivered ones.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Your Orders
            </CardTitle>
            <CardDescription>A list of your current and recently delivered group orders.</CardDescription>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
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
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {(order.status === "Shipped" || order.status === "Processing") && (
                            <Button variant="outline" size="sm" onClick={() => handleTrackOrder(order)}>
                              <Truck className="h-4 w-4 mr-2" />
                              Track Order
                            </Button>
                          )}
                          {order.status === "Delivered" && !order.hasReviewed && (
                            <Button variant="default" size="sm" onClick={() => handleGiveReview(order)}>
                              <Star className="h-4 w-4 mr-2" />
                              Give Review
                            </Button>
                          )}
                          {order.status === "Delivered" && order.hasReviewed && (
                            <Button variant="ghost" size="sm" disabled>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Reviewed
                            </Button>
                          )}
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
              Current status:{" "}
              <Badge variant={getStatusBadgeVariant(selectedOrder?.status || "Processing")}>
                {selectedOrder?.status}
              </Badge>
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="flex-1">
              <OrderTrackingMap
                origin={selectedOrder.originCoords}
                destination={selectedOrder.destinationCoords}
                currentLocation={selectedOrder.currentLocationCoords}
                orderId={selectedOrder.id}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      {selectedOrder && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          orderId={selectedOrder.id}
          supplierName={selectedOrder.supplier}
          onReviewSubmit={handleReviewSubmit}
        />
      )}
    </VendorLayout>
  )
}
