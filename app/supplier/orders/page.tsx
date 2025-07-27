"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Search, Filter, Check, X, Eye } from "lucide-react"
import SupplierLayout from "@/components/supplier-layout"
import { useToast } from "@/components/ui/use-toast"

type IncomingOrder = {
  id: string
  item: string
  quantity: string
  totalVendors: number
  area: string
  status: "Pending" | "Accepted" | "Declined"
  requestedDate: string
  pickupTime: string
}

const incomingOrders: IncomingOrder[] = [
  {
    id: "GO-002",
    item: "Tomatoes",
    quantity: "200 kg",
    totalVendors: 12,
    area: "Lajpat Nagar",
    status: "Pending",
    requestedDate: "2024-07-26",
    pickupTime: "10:00 AM - 12:00 PM",
  },
  {
    id: "GO-005",
    item: "Cabbage",
    quantity: "20 pieces",
    totalVendors: 8,
    area: "Karol Bagh Market",
    status: "Pending",
    requestedDate: "2024-07-27",
    pickupTime: "08:00 AM - 10:00 AM",
  },
  {
    id: "GO-001",
    item: "Onions",
    quantity: "150 kg",
    totalVendors: 15,
    area: "Karol Bagh Market",
    status: "Accepted",
    requestedDate: "2024-07-20",
    pickupTime: "06:00 AM - 08:00 AM",
  },
  {
    id: "GO-003",
    item: "Potatoes",
    quantity: "100 kg",
    totalVendors: 10,
    area: "Chandni Chowk",
    status: "Declined",
    requestedDate: "2024-07-25",
    pickupTime: "02:00 PM - 04:00 PM",
  },
]

export default function SupplierIncomingOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<IncomingOrder[]>(incomingOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterArea, setFilterArea] = useState("All")

  const handleAcceptOrder = (id: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: "Accepted" } : order)))
    toast({
      title: "Order Accepted!",
      description: `Order ${id} has been accepted and moved to Delivery Schedule.`,
    })
  }

  const handleDeclineOrder = (id: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: "Declined" } : order)))
    toast({
      title: "Order Declined!",
      description: `Order ${id} has been declined.`,
      variant: "destructive",
    })
  }

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.area.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = filterStatus === "All" || order.status === filterStatus
    const areaMatch = filterArea === "All" || order.area === filterArea
    return searchMatch && statusMatch && areaMatch
  })

  const getStatusBadgeVariant = (status: IncomingOrder["status"]) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Accepted":
        return "default"
      case "Declined":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Incoming Orders</h1>
          <p className="text-gray-600">Review and manage new group orders from vendors.</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by Order ID, Item, Area..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2 md:space-y-0">
              <Label htmlFor="area-filter" className="sr-only">
                Filter by Area
              </Label>
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger id="area-filter">
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Areas</SelectItem>
                  <SelectItem value="Karol Bagh Market">Karol Bagh Market</SelectItem>
                  <SelectItem value="Lajpat Nagar">Lajpat Nagar</SelectItem>
                  <SelectItem value="Chandni Chowk">Chandni Chowk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("All")
                  setFilterArea("All")
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
              Group Orders by Area
            </CardTitle>
            <CardDescription>New orders requiring your action.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Vendors</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Pickup Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-500">
                        No incoming orders found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.item}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.totalVendors}</TableCell>
                        <TableCell>{order.area}</TableCell>
                        <TableCell>{order.requestedDate}</TableCell>
                        <TableCell>{order.pickupTime}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {order.status === "Pending" ? (
                            <div className="flex gap-2">
                              <Button size="icon" title="Accept Order" onClick={() => handleAcceptOrder(order.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                title="Decline Order"
                                onClick={() => handleDeclineOrder(order.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="icon" title="View Details">
                              <Eye className="h-4 w-4" />
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
    </SupplierLayout>
  )
}
