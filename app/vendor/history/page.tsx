"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Package, Clock, CheckCircle, XCircle, Truck, Eye } from "lucide-react"
import VendorLayout from "@/components/vendor-layout"
import { Progress } from "@/components/ui/progress"

type Order = {
  id: string
  item: string
  quantity: string
  supplier: string
  orderDate: string
  pickupDate: string
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  trackingProgress: number // 0-100
}

const allOrders: Order[] = [
  {
    id: "ORD-001",
    item: "Onions",
    quantity: "50 kg",
    supplier: "Fresh Veggies Co.",
    orderDate: "2024-07-20",
    pickupDate: "2024-07-22",
    status: "Delivered",
    trackingProgress: 100,
  },
  {
    id: "ORD-002",
    item: "Tomatoes",
    quantity: "30 kg",
    supplier: "Green Farms",
    orderDate: "2024-07-25",
    pickupDate: "2024-07-27",
    status: "Shipped",
    trackingProgress: 75,
  },
  {
    id: "ORD-003",
    item: "Potatoes",
    quantity: "100 kg",
    supplier: "Bulk Produce",
    orderDate: "2024-07-26",
    pickupDate: "2024-07-28",
    status: "Processing",
    trackingProgress: 25,
  },
  {
    id: "ORD-004",
    item: "Cabbage",
    quantity: "20 pieces",
    supplier: "Local Harvest",
    orderDate: "2024-07-24",
    pickupDate: "2024-07-26",
    status: "Cancelled",
    trackingProgress: 0,
  },
  {
    id: "ORD-005",
    item: "Ginger",
    quantity: "10 kg",
    supplier: "Spice Route",
    orderDate: "2024-07-27",
    pickupDate: "2024-07-29",
    status: "Processing",
    trackingProgress: 10,
  },
]

export default function VendorOrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>(allOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = filterStatus === "All" || order.status === filterStatus
    return searchMatch && statusMatch
  })

  const getStatusBadgeVariant = (status: Order["status"]) => {
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

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Shipped":
        return <Truck className="h-4 w-4 text-orange-500" />
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Order History</h1>
          <p className="text-gray-600">View your past and current group orders.</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by Order ID, Item, Supplier..."
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
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
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
            <CardDescription>Details of your group orders.</CardDescription>
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
                    <TableHead>Pickup Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-500">
                        No orders found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.item}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.pickupDate}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={order.trackingProgress} className="w-[100px]" />
                            <span className="text-sm text-gray-600">{order.trackingProgress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
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
    </VendorLayout>
  )
}
