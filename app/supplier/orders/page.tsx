"use client"

import { useState } from "react"
import SupplierLayout from "@/components/supplier-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import OrderTrackingMap from "@/components/order-tracking-map"

// Dummy data for incoming orders
const incomingOrders = [
  {
    id: "INC001",
    product: "Onions",
    quantity: "50 kg",
    vendor: "Rajesh Kumar",
    status: "Pending",
    pickupTime: "2024-08-01 10:00 AM",
    origin: [28.6139, 77.209], // Delhi
    destination: [28.7041, 77.1025], // Rohini
    currentLocation: [28.65, 77.15], // Simulated current location
  },
  {
    id: "INC002",
    product: "Tomatoes",
    quantity: "30 kg",
    vendor: "Priya Foods",
    status: "Accepted",
    pickupTime: "2024-08-02 02:00 PM",
    origin: [28.5355, 77.391], // Noida
    destination: [28.6139, 77.209], // Delhi
    currentLocation: [28.58, 77.3], // Simulated current location
  },
  {
    id: "INC003",
    product: "Potatoes",
    quantity: "100 kg",
    vendor: "Vendor Mart",
    status: "Accepted",
    pickupTime: "2024-07-28 09:00 AM",
    origin: [28.7041, 77.1025], // Rohini
    destination: [28.6139, 77.209], // Delhi
    currentLocation: [28.6139, 77.209], // Simulated current location (delivered)
  },
  {
    id: "INC004",
    product: "Carrots",
    quantity: "20 kg",
    vendor: "Fresh Bites",
    status: "Rejected",
    pickupTime: "2024-08-05 11:00 AM",
    origin: [28.6139, 77.209],
    destination: [28.7041, 77.1025],
    currentLocation: [28.6139, 77.209],
  },
  {
    id: "INC005",
    product: "Cabbage",
    quantity: "10 pieces",
    vendor: "Daily Needs",
    status: "Accepted",
    pickupTime: "2024-07-29 03:00 PM",
    origin: [28.5355, 77.391],
    destination: [28.6139, 77.209],
    currentLocation: [28.6139, 77.209],
  },
]

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState(incomingOrders)

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Accepted":
        return "default"
      case "Rejected":
        return "destructive"
      case "Preparing":
        return "outline"
      case "Out for Delivery":
        return "default"
      case "Delivered":
        return "success"
      default:
        return "secondary"
    }
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
                  <TableHead>Pickup Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.vendor}</TableCell>
                    <TableCell>{order.pickupTime}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === "Pending" && (
                        <div className="flex justify-end gap-2">
                          <Button variant="default" size="sm" onClick={() => handleStatusChange(order.id, "Accepted")}>
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "Rejected")}
                            className="bg-transparent"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {order.status === "Accepted" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "Preparing")}
                            className="bg-transparent"
                          >
                            Mark as Preparing
                          </Button>
                        </div>
                      )}
                      {order.status === "Preparing" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleStatusChange(order.id, "Out for Delivery")}
                          >
                            Out for Delivery
                          </Button>
                        </div>
                      )}
                      {order.status === "Out for Delivery" && (
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                Track Delivery
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Track Order {order.id}</DialogTitle>
                              </DialogHeader>
                              <div className="h-[400px] w-full">
                                <OrderTrackingMap
                                  origin={order.origin}
                                  destination={order.destination}
                                  currentLocation={order.currentLocation}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="default" size="sm" onClick={() => handleStatusChange(order.id, "Delivered")}>
                            Mark as Delivered
                          </Button>
                        </div>
                      )}
                      {order.status === "Delivered" && <Badge variant="success">Delivered</Badge>}
                      {order.status === "Rejected" && <Badge variant="destructive">Rejected</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  )
}
