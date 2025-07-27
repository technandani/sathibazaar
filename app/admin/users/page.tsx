"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, User, CheckCircle, XCircle, Eye, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

type UserRole = "Vendor" | "Supplier" | "Admin";
type UserStatus = "Active" | "Inactive" | "Suspended";
type VerificationStatus = "Verified" | "Unverified";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  verification: VerificationStatus;
  lastLogin: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVerification, setFilterVerification] = useState("All");
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("Vendor");
  const [editStatus, setEditStatus] = useState<UserStatus>("Active");
  const [editVerification, setEditVerification] = useState<VerificationStatus>("Verified");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Server error", variant: "destructive" });
      }
    };
    if (user && user.role === "admin") fetchUsers();
  }, [user, toast]);

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = filterRole === "All" || user.role === filterRole;
    const statusMatch = filterStatus === "All" || user.status === filterStatus;
    const verificationMatch = filterVerification === "All" || user.verification === filterVerification;
    return searchMatch && roleMatch && statusMatch && verificationMatch;
  });

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getVerificationBadgeVariant = (verification: VerificationStatus) => {
    switch (verification) {
      case "Verified":
        return "default";
      case "Unverified":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user);
    setIsViewDetailsOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditVerification(user.verification);
    setIsEditUserOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedUser) {
      try {
        const response = await fetch("/api/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: selectedUser.id,
            name: editName,
            email: editEmail,
            role: editRole,
            status: editStatus,
            verification: editVerification,
          }),
        });
        if (response.ok) {
          setUsers(
            users.map((u) =>
              u.id === selectedUser.id
                ? { ...u, name: editName, email: editEmail, role: editRole, status: editStatus, verification: editVerification }
                : u
            )
          );
          toast({ title: "User Updated!", description: `User ${selectedUser.name} has been updated.` });
          setIsEditUserOpen(false);
          setSelectedUser(null);
        } else {
          toast({ title: "Error", description: (await response.json()).message, variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Server error", variant: "destructive" });
      }
    }
  };

  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        const response = await fetch("/api/users", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: selectedUser.id }),
        });
        if (response.ok) {
          setUsers(users.filter((u) => u.id !== selectedUser.id));
          toast({
            title: "User Deleted!",
            description: `User ${selectedUser.name} has been deleted.`,
            variant: "destructive",
          });
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        } else {
          toast({ title: "Error", description: (await response.json()).message, variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Server error", variant: "destructive" });
      }
    }
  };

  return (
    <ProtectedRoute role="admin">
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">User Management</h1>
            <p className="text-gray-600">Manage all users, including vendors, suppliers, and admins.</p>
          </div>

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
                    setSearchTerm("");
                    setFilterRole("All");
                    setFilterStatus("All");
                    setFilterVerification("All");
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

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
                      <TableHead>Verification</TableHead>
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
                            <Badge variant={getVerificationBadgeVariant(user.verification)} className="flex items-center gap-1">
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
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" title="View Details" onClick={() => handleViewDetails(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" title="Edit User" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                title="Delete User"
                                onClick={() => handleDeleteUser(user)}
                              >
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

        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
              <DialogDescription>Full information about the selected user.</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>ID:</Label>
                  <div className="col-span-2">{selectedUser.id}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Name:</Label>
                  <div className="col-span-2">{selectedUser.name}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Email:</Label>
                  <div className="col-span-2">{selectedUser.email}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Role:</Label>
                  <div className="col-span-2">{selectedUser.role}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Status:</Label>
                  <div className="col-span-2">
                    <Badge variant={getStatusBadgeVariant(selectedUser.status)}>{selectedUser.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Verification:</Label>
                  <div className="col-span-2">
                    <Badge variant={getVerificationBadgeVariant(selectedUser.verification)}>
                      {selectedUser.verification}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Last Login:</Label>
                  <div className="col-span-2">{selectedUser.lastLogin}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
              <DialogDescription>Update the details for this user.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={editRole} onValueChange={(value) => setEditRole(value as UserRole)}>
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vendor">Vendor</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editStatus} onValueChange={(value) => setEditStatus(value as UserStatus)}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-verification">Verification</Label>
                <Select value={editVerification} onValueChange={(value) => setEditVerification(value as VerificationStatus)}>
                  <SelectTrigger id="edit-verification">
                    <SelectValue placeholder="Select verification status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete user &quot;{selectedUser?.name}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}