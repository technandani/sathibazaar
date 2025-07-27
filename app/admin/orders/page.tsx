"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Search, Filter, Eye } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type OrderStatus = "Completed" | "Pending" | "In Progress" | "Pending Pickup" | "Cancelled"

type OrderData = {
  id: string
  item: string
  quantity: string
  totalAmount: string
  vendor: string
  supplier: string
  status: OrderStatus
  date: string
}

const allOrders: OrderData[] = [
  {
    id: "GO-001",
    item: "Onions",
    quantity: "150 kg",
    totalAmount: "₹3750",
    vendor: "Rajesh Kumar",
    supplier: "Suresh Vegetables",
    status: "Completed",
    date: "2024-07-20",
  },
  {
    id: "GO-002",
    item: "Tomatoes",
    quantity: "200 kg",
    totalAmount: "₹7000",
    vendor: "Priya Sharma",
    supplier: "Fresh Mart",
    status: "Pending",
    date: "2024-07-26",
  },
  {
    id: "GO-003",
    item: "Potatoes",
    quantity: "100 kg",
    totalAmount: "₹1800",
    vendor: "Amit Singh",
    supplier: "Green Valley",
    status: "In Progress",
    date: "2024-07-25",
  },
  {
    id: "GO-004",
    item: "Ginger",
    quantity: "50 kg",
    totalAmount: "₹4000",
    vendor: "Kiran Devi",
    supplier: "Local Farms",
    status: "Completed",
    date: "2024-07-22",
  },
  {
    id: "GO-005",
    item: "Cabbage",
    quantity: "20 pieces",
    totalAmount: "₹500",
    vendor: "Sunil Kumar",
    supplier: "Suresh Vegetables",
    status: "Pending Pickup",
    date: "2024-07-27",
  },
  {
    id: "GO-006",
    item: "Spinach",
    quantity: "30 bunches",
    totalAmount: "₹450",
    vendor: "Rajesh Kumar",
    supplier: "Green Valley",
    status: "Cancelled",
    date: "2024-07-28",
  },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>(allOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterDate, setFilterDate] = useState("")

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = filterStatus === "All" || order.status === filterStatus
    const dateMatch = filterDate === "" || order.date === filterDate
    return searchMatch && statusMatch && dateMatch
  })

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Pending":
        return "secondary"
      case "In Progress":
        return "outline"
      case "Pending Pickup":
        return "outline"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleViewDetails = (order: OrderData) => {
    setSelectedOrder(order)
    setIsViewDetailsOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Order Management</h1>
          <p className="text-gray-600">View and manage all group orders on the platform.</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by Order ID, Item, Vendor, Supplier..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2 md:space-y-0">
              <Label htmlFor="status-filter" className="sr-only">
                Filter by Status
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2 md:space-y-0">
              <Label htmlFor="date-filter" className="sr-only">
                Filter by Date
              </Label>
              <Input id="date-filter" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("All")
                  setFilterDate("")
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
              <ShoppingBag className="h-5 w-5 mr-2" />
              All Group Orders
            </CardTitle>
            <CardDescription>A comprehensive list of all group orders on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
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
                        <TableCell className="font-semibold">{order.totalAmount}</TableCell>
                        <TableCell>{order.vendor}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            title="View Details"
                            onClick={() => handleViewDetails(order)}
                          >
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

      {/* View Order Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details: {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Comprehensive information about this order.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Order ID:</Label>
                <div className="col-span-2">{selectedOrder.id}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Item:</Label>
                <div className="col-span-2">{selectedOrder.item}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Quantity:</Label>
                <div className="col-span-2">{selectedOrder.quantity}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Total Amount:</Label>
                <div className="col-span-2">{selectedOrder.totalAmount}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Vendor:</Label>
                <div className="col-span-2">{selectedOrder.vendor}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Supplier:</Label>
                <div className="col-span-2">{selectedOrder.supplier}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Status:</Label>
                <div className="col-span-2">
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Order Date:</Label>
                <div className="col-span-2">{selectedOrder.date}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
