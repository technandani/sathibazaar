"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Filter, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

const users = [
  {
    id: "V-001",
    name: "Rajesh Kumar",
    type: "Vendor",
    email: "rajesh@example.com",
    status: "Active",
    isVerified: true,
    joined: "2023-01-15",
  },
  {
    id: "S-001",
    name: "Suresh Vegetables",
    type: "Supplier",
    email: "suresh@example.com",
    status: "Active",
    isVerified: true,
    joined: "2023-02-01",
  },
  {
    id: "V-002",
    name: "Priya Sharma",
    type: "Vendor",
    email: "priya@example.com",
    status: "Inactive",
    isVerified: false,
    joined: "2023-03-10",
  },
  {
    id: "S-002",
    name: "Fresh Mart",
    type: "Supplier",
    email: "freshmart@example.com",
    status: "Pending",
    isVerified: false,
    joined: "2023-04-05",
  },
  {
    id: "V-003",
    name: "Amit Singh",
    type: "Vendor",
    email: "amit@example.com",
    status: "Active",
    isVerified: true,
    joined: "2023-05-20",
  },
]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterVerification, setFilterVerification] = useState("All")

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    const typeMatch = filterType === "All" || user.type === filterType
    const statusMatch = filterStatus === "All" || user.status === filterStatus
    const verificationMatch =
      filterVerification === "All" ||
      (filterVerification === "Verified" && user.isVerified) ||
      (filterVerification === "Unverified" && !user.isVerified)
    return searchMatch && typeMatch && statusMatch && verificationMatch
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "destructive"
      case "Pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">User Management</h1>
          <p className="text-gray-600">Manage all vendors and suppliers on the SathiBazaar platform.</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, email, or ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2 md:space-y-0">
              <Label htmlFor="type-filter" className="sr-only">
                Filter by Type
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2 md:space-y-0">
              <Label htmlFor="verification-filter" className="sr-only">
                Filter by Verification
              </Label>
              <Select value={filterVerification} onValueChange={setFilterVerification}>
                <SelectTrigger id="verification-filter">
                  <SelectValue placeholder="All Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Verification</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("All")
                  setFilterStatus("All")
                  setFilterVerification("All")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Platform Users
            </CardTitle>
            <CardDescription>A comprehensive list of all registered users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">
                        No users found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Badge variant={user.type === "Vendor" ? "default" : "secondary"}>{user.type}</Badge>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.isVerified ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" /> Unverified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" title="Edit User">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" title="Delete User">
                              <Trash2 className="h-4 w-4" />
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
