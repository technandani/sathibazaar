"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Package, CheckCircle, XCircle, MapPin } from "lucide-react"
import SupplierLayout from "@/components/supplier-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import OrderTrackingMap from "@/components/order-tracking-map"
import { useToast } from "@/components/ui/use-toast"

type OrderStatus = "Pending" | "Accepted" | "Rejected" | "Preparing" | "Out for Delivery" | "Delivered"

type Order = {
  id: string
  item: string
  quantity: string
  vendorName: string
  orderDate: string
  deliveryDate: string
  status: OrderStatus
  originCoords: [number, number] // Supplier's location
  destinationCoords: [number, number] // Vendor's location
  currentLocationCoords?: [number, number] // Optional, for real-time tracking
}

const initialOrders: Order[] = [
  {
    id: "SO-001",
    item: "Fresh Onions",
    quantity: "50 kg",
    vendorName: "Rajesh Kumar",
    orderDate: "2024-07-28",
    deliveryDate: "2024-07-30",
    status: "Pending",
    originCoords: [28.6139, 77.209], // Delhi
    destinationCoords: [28.5355, 77.391], // Noida
  },
  {
    id: "SO-002",
    item: "Organic Tomatoes",
    quantity: "30 kg",
    vendorName: "Priya Sharma",
    orderDate: "2024-07-27",
    deliveryDate: "2024-07-29",
    status: "Accepted",
    originCoords: [19.076, 72.8777], // Mumbai
    destinationCoords: [18.5204, 73.8567], // Pune
    currentLocationCoords: [18.7, 73.5], // Simulated current location
  },
  {
    id: "SO-003",
    item: "Local Potatoes",
    quantity: "100 kg",
    vendorName: "Amit Singh",
    orderDate: "2024-07-26",
    deliveryDate: "2024-07-28",
    status: "Rejected",
    originCoords: [22.5726, 88.3639], // Kolkata
    destinationCoords: [22.5726, 88.3639],
  },
  {
    id: "SO-004",
    item: "Green Cabbage",
    quantity: "20 pieces",
    vendorName: "Kiran Devi",
    orderDate: "2024-07-25",
    deliveryDate: "2024-07-27",
    status: "Out for Delivery",
    originCoords: [12.9716, 77.5946], // Bangalore
    destinationCoords: [12.9716, 77.5946],
    currentLocationCoords: [12.98, 77.58],
  },
  {
    id: "SO-005",
    item: "Fresh Ginger",
    quantity: "10 kg",
    vendorName: "Sunil Verma",
    orderDate: "2024-07-24",
    deliveryDate: "2024-07-26",
    status: "Delivered",
    originCoords: [26.9124, 75.7873], // Jaipur
    destinationCoords: [26.8, 75.9],
  },
]

export default function SupplierIncomingOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = filterStatus === "All" || order.status === filterStatus
    return searchMatch && statusMatch
  })

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Accepted":
        return "default"
      case "Rejected":
        return "destructive"
      case "Preparing":
        return "info" // Assuming 'info' variant exists or can be styled
      case "Out for Delivery":
        return "warning" // Assuming 'warning' variant exists or can be styled
      case "Delivered":
        return "success" // Assuming 'success' variant exists or can be styled
      default:
        return "outline"
    }
  }

  const handleAcceptOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: "Accepted" } : order)),
    )
    toast({
      title: "Order Accepted!",
      description: `Order ${orderId} has been accepted.`,
    })
  }

  const handleRejectOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: "Rejected" } : order)),
    )
    toast({
      title: "Order Rejected!",
      description: `Order ${orderId} has been rejected.`,
      variant: "destructive",
    })
  }

  const handleTrackDelivery = (order: Order) => {
    setSelectedOrder(order)
    setIsMapOpen(true)
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Incoming Orders</h1>
          <p className="text-gray-600">Manage new and ongoing orders from vendors.</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by Order ID, Item, Vendor..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Preparing">Preparing</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("All")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Your Orders
            </CardTitle>
            <CardDescription>Details of incoming and processed orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">
                        No orders found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.item}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.vendorName}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          {order.status === "Pending" && (
                            <>
                              <Button variant="default" size="sm" onClick={() => handleAcceptOrder(order.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleRejectOrder(order.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          {(order.status === "Accepted" ||
                            order.status === "Preparing" ||
                            order.status === "Out for Delivery") && (
                            <Button variant="outline" size="sm" onClick={() => handleTrackDelivery(order)}>
                              <MapPin className="h-4 w-4 mr-2" />
                              Track Delivery
                            </Button>
                          )}
                          {order.status === "Delivered" && (
                            <Button variant="ghost" size="sm" disabled>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Delivered
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

      {/* Order Tracking Map Dialog for Supplier */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-3xl w-full h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Track Delivery for Order: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Status:{" "}
              <Badge variant={getStatusBadgeVariant(selectedOrder?.status || "Accepted")}>
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
    </SupplierLayout>
  )
}
