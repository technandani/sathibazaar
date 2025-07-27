"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Search, Filter, Eye, CheckCircle, MessageSquare, Loader2 } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Complaint as ComplaintType } from "@/lib/db" // Import ComplaintType from lib/db

type ComplaintStatus = "Open" | "In Progress" | "Resolved"
type ComplaintPriority = "High" | "Medium" | "Low"

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintType | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/complaints")
      if (response.ok) {
        const data: ComplaintType[] = await response.json()
        setComplaints(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch complaints.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error)
      toast({
        title: "Error",
        description: "Could not connect to the server to fetch complaints.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const searchMatch =
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issue.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = filterStatus === "All" || complaint.status === filterStatus
    const priorityMatch = filterPriority === "All" || complaint.priority === filterPriority
    return searchMatch && statusMatch && priorityMatch
  })

  const getStatusBadgeVariant = (status: ComplaintStatus) => {
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

  const getPriorityBadgeVariant = (priority: ComplaintPriority) => {
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

  const handleViewDetails = (complaint: ComplaintType) => {
    setSelectedComplaint(complaint)
    setIsViewDetailsOpen(true)
  }

  const handleMarkAsResolved = async (complaintId: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/complaints", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: complaintId, status: "Resolved", resolutionNotes: "Resolved by admin." }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Complaint Resolved!",
          description: `Complaint ${complaintId} has been marked as resolved.`,
        })
        fetchComplaints() // Re-fetch to update status
      } else {
        toast({
          title: "Resolution Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Complaint resolution error:", error)
      toast({
        title: "Error",
        description: "Could not connect to the server to resolve complaint.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = (complaint: ComplaintType) => {
    setSelectedComplaint(complaint)
    setReplyMessage("") // Clear previous reply message
    setIsReplyModalOpen(true)
  }

  const sendReply = async () => {
    if (!selectedComplaint || !replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Reply message cannot be empty.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate sending a reply (in a real app, this would interact with an email/notification service)
      console.log(`Simulating reply to ${selectedComplaint.user} (${selectedComplaint.id}): ${replyMessage}`)
      toast({
        title: "Reply Sent!",
        description: `Your reply to complaint ${selectedComplaint.id} has been sent (simulated).`,
      })
      setIsReplyModalOpen(false)
      setReplyMessage("")
    } catch (error) {
      console.error("Reply sending error:", error)
      toast({
        title: "Error",
        description: "Could not send reply.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading complaints...</span>
        </div>
      </AdminLayout>
    )
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
                            <Button
                              variant="outline"
                              size="icon"
                              title="View Details"
                              onClick={() => handleViewDetails(complaint)}
                              disabled={isSubmitting}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {complaint.status !== "Resolved" && (
                              <Button
                                variant="default"
                                size="icon"
                                title="Mark as Resolved"
                                onClick={() => handleMarkAsResolved(complaint.id)}
                                disabled={isSubmitting}
                              >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="secondary"
                              size="icon"
                              title="Reply"
                              onClick={() => handleReply(complaint)}
                              disabled={isSubmitting}
                            >
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

      {/* View Complaint Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complaint Details: {selectedComplaint?.id}</DialogTitle>
            <DialogDescription>Full information about the reported issue.</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Complaint ID:</Label>
                <div className="col-span-2">{selectedComplaint.id}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>User:</Label>
                <div className="col-span-2">
                  {selectedComplaint.user} ({selectedComplaint.userType})
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Issue:</Label>
                <div className="col-span-2">{selectedComplaint.issue}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Status:</Label>
                <div className="col-span-2">
                  <Badge variant={getStatusBadgeVariant(selectedComplaint.status)}>{selectedComplaint.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Priority:</Label>
                <div className="col-span-2">
                  <Badge variant={getPriorityBadgeVariant(selectedComplaint.priority)}>
                    {selectedComplaint.priority}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Date:</Label>
                <div className="col-span-2">{selectedComplaint.date}</div>
              </div>
              {selectedComplaint.resolutionNotes && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Resolution Notes:</Label>
                  <div className="col-span-2 text-sm text-gray-700">{selectedComplaint.resolutionNotes}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply to Complaint Dialog */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to Complaint: {selectedComplaint?.id}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedComplaint?.user} regarding their complaint.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reply-message">Your Message</Label>
              <Textarea
                id="reply-message"
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={sendReply} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
