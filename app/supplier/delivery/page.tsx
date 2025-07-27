"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Search, Filter, Clock, MapPin } from "lucide-react"
import SupplierLayout from "@/components/supplier-layout"
import { useToast } from "@/components/ui/use-toast"

type DeliveryOrder = {
  id: string
  item: string
  quantity: string
  vendor: string
  pickupLocation: string
  pickupTime: string
  status: "Scheduled" | "Ready for Pickup" | "Picked Up" | "Delayed"
  deliveryLead: string
}

const deliverySchedule: DeliveryOrder[] = [
  {
    id: "GO-001",
    item: "Onions",
    quantity: "150 kg",
    vendor: "Rajesh Kumar",
    pickupLocation: "Karol Bagh Market",
    pickupTime: "06:00 AM - 08:00 AM",
    status: "Ready for Pickup",
    deliveryLead: "Self Pickup",
  },
  {
    id: "GO-002",
    item: "Tomatoes",
    quantity: "200 kg",
    vendor: "Priya Sharma",
    pickupLocation: "Lajpat Nagar",
    pickupTime: "10:00 AM - 12:00 PM",
    status: "Scheduled",
    deliveryLead: "Suresh Delivery",
  },
  {
    id: "GO-005",
    item: "Cabbage",
    quantity: "20 pieces",
    vendor: "Sunil Kumar",
    pickupLocation: "Karol Bagh Market",
    pickupTime: "08:00 AM - 10:00 AM",
    status: "Scheduled",
    deliveryLead: "Self Pickup",
  },
  {
    id: "GO-003",
    item: "Potatoes",
    quantity: "100 kg",
    vendor: "Amit Singh",
    pickupLocation: "Chandni Chowk",
    pickupTime: "02:00 PM - 04:00 PM",
    status: "Picked Up",
    deliveryLead: "Self Pickup",
  },
]

export default function SupplierDeliverySchedulePage() {
  const { toast } = useToast()
  const [schedule, setSchedule] = useState<DeliveryOrder[]>(deliverySchedule)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterLocation, setFilterLocation] = useState("All")

  const handleUpdateStatus = (id: string, newStatus: DeliveryOrder["status"]) => {
    setSchedule(schedule.map((order) => (order.id === id ? { ...order, status: newStatus } : order)))
    toast({
      title: "Status Updated!",
      description: `Order ${id} status changed to ${newStatus}.`,
    })
  }

  const filteredSchedule = schedule.filter((order) => {
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = filterStatus === "All" || order.status === filterStatus
    const locationMatch = filterLocation === "All" || order.pickupLocation === filterLocation
    return searchMatch && statusMatch && locationMatch
  })

  const getStatusBadgeVariant = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "Scheduled":
        return "secondary"
      case "Ready for Pickup":
        return "default"
      case "Picked Up":
        return "outline"
      case "Delayed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Delivery Schedule</h1>
          <p className="text-gray-600">Manage your accepted orders and track their delivery/pickup status.</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by Order ID, Item, Vendor, Location..."
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
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                  <SelectItem value="Picked Up">Picked Up</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2 md:space-y-0">
              <Label htmlFor="location-filter" className="sr-only">
                Filter by Location
              </Label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Locations</SelectItem>
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
                  setFilterLocation("All")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Schedule List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Your Delivery Schedule
            </CardTitle>
            <CardDescription>Accepted orders and their pickup/delivery details.</CardDescription>
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
                    <TableHead>Pickup Location</TableHead>
                    <TableHead>Pickup Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery Lead</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedule.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-gray-500">
                        No orders in your delivery schedule matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchedule.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.item}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.vendor}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          {order.pickupLocation}
                        </TableCell>
                        <TableCell className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          {order.pickupTime}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.deliveryLead}</TableCell>
                        <TableCell>
                          {order.status !== "Picked Up" && (
                            <Select
                              onValueChange={(value: DeliveryOrder["status"]) => handleUpdateStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-[140px] h-8">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                                <SelectItem value="Picked Up">Picked Up</SelectItem>
                                <SelectItem value="Delayed">Delayed</SelectItem>
                              </SelectContent>
                            </Select>
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
