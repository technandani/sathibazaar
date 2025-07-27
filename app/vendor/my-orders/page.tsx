"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import VendorLayout from "@/components/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import OrderTrackingMap from "@/components/order-tracking-map"
import ReviewModal from "@/components/review-modal"
import { Package, MapPin, Star, Eye } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled"

type Order = {
  id: string
  item: string
  quantity: string
  supplier: string
  orderDate: string
  deliveryDate: string
  status: OrderStatus
  progress: number // 0-100
  originCoords: [number, number] // Supplier's location
  destinationCoords: [number, number] // Vendor's location
  currentLocationCoords?: [number, number] // Optional, for real-time tracking
  reviewed: boolean
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    item: "Fresh Onions",
    quantity: "50 kg",
    supplier: "Suresh Vegetables",
    orderDate: "2024-07-28",
    deliveryDate: "2024-07-30",
    status: "Shipped",
    progress: 75,
    originCoords: [28.6139, 77.209], // Delhi
    destinationCoords: [28.5355, 77.391], // Noida
    currentLocationCoords: [28.58, 77.3], // Simulated current location
    reviewed: false,
  },
  {
    id: "ORD-002",
    item: "Organic Tomatoes",
    quantity: "30 kg",
    supplier: "Fresh Mart",
    orderDate: "2024-07-27",
    deliveryDate: "2024-07-29",
    status: "Delivered",
    progress: 100,
    originCoords: [19.076, 72.8777], // Mumbai
    destinationCoords: [18.5204, 73.8567], // Pune
    reviewed: false,
  },
  {
    id: "ORD-003",
    item: "Local Potatoes",
    quantity: "100 kg",
    supplier: "Green Valley Farms",
    orderDate: "2024-07-26",
    deliveryDate: "2024-07-28",
    status: "Processing",
    progress: 25,
    originCoords: [22.5726, 88.3639], // Kolkata
    destinationCoords: [22.5726, 88.3639],
    reviewed: false,
  },
  {
    id: "ORD-004",
    item: "Green Cabbage",
    quantity: "20 pieces",
    supplier: "Suresh Vegetables",
    orderDate: "2024-07-25",
    deliveryDate: "2024-07-27",
    status: "Cancelled",
    progress: 0,
    originCoords: [12.9716, 77.5946], // Bangalore
    destinationCoords: [12.9716, 77.5946],
    reviewed: false,
  },
  {
    id: "ORD-005",
    item: "Fresh Ginger",
    quantity: "10 kg",
    supplier: "Fresh Mart",
    orderDate: "2024-07-24",
    deliveryDate: "2024-07-26",
    status: "Delivered",
    progress: 100,
    originCoords: [26.9124, 75.7873], // Jaipur
    destinationCoords: [26.8, 75.9],
    reviewed: true, // Already reviewed
  },
]

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
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

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (selectedOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === selectedOrder.id ? { ...order, reviewed: true } : order)),
      )
      toast({
        title: "Review Submitted!",
        description: `Thank you for reviewing order ${selectedOrder.id}. Rating: ${rating} stars.`,
      })
      setIsReviewModalOpen(false)
      setSelectedOrder(null)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
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
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {order.status !== "Cancelled" && (
                            <div className="flex items-center gap-2">
                              <Progress value={order.progress} className="w-[100px]" />
                              <span className="text-sm text-gray-600">{order.progress}%</span>
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
                            {order.status === "Delivered" && !order.reviewed && (
                              <Button variant="default" size="sm" onClick={() => handleGiveReview(order)}>
                                <Star className="h-4 w-4 mr-1" />
                                Give Review
                              </Button>
                            )}
                            {order.status === "Delivered" && order.reviewed && (
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
                <div>{selectedOrder.orderDate}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Delivery Date:</Label>
                <div>{selectedOrder.deliveryDate}</div>
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
                    <Progress value={selectedOrder.progress} className="w-[150px]" />
                    <span className="text-sm text-gray-600">{selectedOrder.progress}%</span>
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
