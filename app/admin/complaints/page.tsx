"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Search, Filter, Eye, CheckCircle, MessageSquare } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

const complaints = [
  {
    id: "CMP-001",
    user: "Rajesh Kumar",
    userType: "Vendor",
    issue: "Late delivery of onions (Order GO-001)",
    status: "Open",
    priority: "High",
    date: "2024-07-21",
  },
  {
    id: "CMP-002",
    user: "Suresh Vegetables",
    userType: "Supplier",
    issue: "Payment delay for Order GO-001",
    status: "Resolved",
    priority: "Medium",
    date: "2024-07-22",
  },
  {
    id: "CMP-003",
    user: "Priya Sharma",
    userType: "Vendor",
    issue: "Quality issue with tomatoes (Order GO-002)",
    status: "In Progress",
    priority: "High",
    date: "2024-07-26",
  },
  {
    id: "CMP-004",
    user: "Amit Singh",
    userType: "Vendor",
    issue: "Incorrect quantity received for potatoes",
    status: "Open",
    priority: "Medium",
    date: "2024-07-26",
  },
]

export default function AdminComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")

  const filteredComplaints = complaints.filter((complaint) => {
    const searchMatch =
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issue.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = filterStatus === "All" || complaint.status === filterStatus
    const priorityMatch = filterPriority === "All" || complaint.priority === filterPriority
    return searchMatch && statusMatch && priorityMatch
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "destructive"
      case "In Progress":
        return "secondary"
      case "Resolved":
        return "default"
      default:
        return "outline"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Complaints Management</h1>
          <p className="text-gray-600">Manage and resolve complaints from vendors and suppliers.</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by ID, User, Issue..."
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
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2 md:space-y-0">
              <Label htmlFor="priority-filter" className="sr-only">
                Filter by Priority
              </Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("All")
                  setFilterPriority("All")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              All Complaints
            </CardTitle>
            <CardDescription>A list of all reported complaints.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">
                        No complaints found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{complaint.id}</TableCell>
                        <TableCell>{complaint.user}</TableCell>
                        <TableCell>{complaint.userType}</TableCell>
                        <TableCell>{complaint.issue}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(complaint.status)}>{complaint.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(complaint.priority)}>{complaint.priority}</Badge>
                        </TableCell>
                        <TableCell>{complaint.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {complaint.status !== "Resolved" && (
                              <Button variant="default" size="icon" title="Mark as Resolved">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="secondary" size="icon" title="Reply">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
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
    </AdminLayout>
  )
}
