"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, User, CheckCircle, XCircle } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

type UserRole = "Vendor" | "Supplier" | "Admin"
type UserStatus = "Active" | "Inactive" | "Suspended"
type VerificationStatus = "Verified" | "Unverified"

type UserData = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  verification: VerificationStatus
  lastLogin: string
}

const allUsers: UserData[] = [
  {
    id: "USR-001",
    name: "Rajesh Kumar",
    email: "rajesh.k@example.com",
    role: "Vendor",
    status: "Active",
    verification: "Verified",
    lastLogin: "2024-07-28",
  },
  {
    id: "USR-002",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    role: "Supplier",
    status: "Active",
    verification: "Verified",
    lastLogin: "2024-07-27",
  },
  {
    id: "USR-003",
    name: "Amit Singh",
    email: "amit.s@example.com",
    role: "Vendor",
    status: "Inactive",
    verification: "Unverified",
    lastLogin: "2024-07-20",
  },
  {
    id: "USR-004",
    name: "Kiran Devi",
    email: "kiran.d@example.com",
    role: "Supplier",
    status: "Suspended",
    verification: "Verified",
    lastLogin: "2024-07-15",
  },
  {
    id: "USR-005",
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    status: "Active",
    verification: "Verified",
    lastLogin: "2024-07-29",
  },
  {
    id: "USR-006",
    name: "New Vendor",
    email: "new.vendor@example.com",
    role: "Vendor",
    status: "Active",
    verification: "Unverified",
    lastLogin: "2024-07-29",
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>(allUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterVerification, setFilterVerification] = useState("All") // New filter state

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    const roleMatch = filterRole === "All" || user.role === filterRole
    const statusMatch = filterStatus === "All" || user.status === filterStatus
    const verificationMatch = filterVerification === "All" || user.verification === filterVerification // New filter logic
    return searchMatch && roleMatch && statusMatch && verificationMatch
  })

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "secondary"
      case "Suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getVerificationBadgeVariant = (verification: VerificationStatus) => {
    switch (verification) {
      case "Verified":
        return "default"
      case "Unverified":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">User Management</h1>
          <p className="text-gray-600">Manage all users, including vendors, suppliers, and admins.</p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by Name, Email, ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterVerification} onValueChange={setFilterVerification}>
                {" "}
                {/* New Verification Filter */}
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Verification" />
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
                  setFilterRole("All")
                  setFilterStatus("All")
                  setFilterVerification("All") // Reset new filter
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
              <User className="h-5 w-5 mr-2" />
              All Users
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
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead> {/* New column */}
                    <TableHead>Last Login</TableHead>
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
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getVerificationBadgeVariant(user.verification)}
                            className="flex items-center gap-1"
                          >
                            {user.verification === "Verified" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {user.verification}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Edit
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
    </AdminLayout>
  )
}
