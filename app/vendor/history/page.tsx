"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Calendar, Filter } from "lucide-react"
import VendorLayout from "@/components/vendor-layout"

const orderHistory = [
  {
    id: "GO-001",
    item: "Onions",
    quantity: "50 kg",
    finalPrice: "₹1250",
    status: "Completed",
    date: "2024-07-20",
    supplier: "Suresh Vegetables",
  },
  {
    id: "GO-002",
    item: "Tomatoes",
    quantity: "30 kg",
    finalPrice: "₹1050",
    status: "Completed",
    date: "2024-07-18",
    supplier: "Fresh Mart",
  },
  {
    id: "GO-003",
    item: "Potatoes",
    quantity: "20 kg",
    finalPrice: "₹360",
    status: "Cancelled",
    date: "2024-07-15",
    supplier: "Green Valley",
  },
  {
    id: "GO-004",
    item: "Green Chili",
    quantity: "5 kg",
    finalPrice: "₹350",
    status: "Completed",
    date: "2024-07-10",
    supplier: "Local Farms",
  },
  {
    id: "GO-005",
    item: "Cabbage",
    quantity: "10 pieces",
    finalPrice: "₹200",
    status: "Pending Pickup",
    date: "2024-07-26",
    supplier: "Suresh Vegetables",
  },
]

export default function VendorOrderHistoryPage() {
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterDate, setFilterDate] = useState("")

  const filteredOrders = orderHistory.filter((order) => {
    const statusMatch = filterStatus === "All" || order.status === filterStatus
    const dateMatch = filterDate === "" || order.date === filterDate
    return statusMatch && dateMatch
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Cancelled":
        return "destructive"
      case "Pending Pickup":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Order History</h1>
          <p className="text-gray-600">View your past group orders and their current status.</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="date-filter">Filter by Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="date-filter"
                  type="date"
                  className="pl-9"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterStatus("All")
                  setFilterDate("")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Your Past Orders
            </CardTitle>
            <CardDescription>A list of all your group orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Final Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
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
                        <TableCell className="font-semibold">{order.finalPrice}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
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
