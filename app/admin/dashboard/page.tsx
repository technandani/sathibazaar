import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingBag, TrendingUp, AlertTriangle, DollarSign, Package } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

const recentOrders = [
  {
    id: "ORD-001",
    vendor: "Rajesh Kumar",
    supplier: "Suresh Vegetables",
    item: "Onions",
    amount: "₹2,400",
    status: "completed",
  },
  {
    id: "ORD-002",
    vendor: "Priya Sharma",
    supplier: "Fresh Mart",
    item: "Tomatoes",
    amount: "₹1,800",
    status: "pending",
  },
  {
    id: "ORD-003",
    vendor: "Amit Singh",
    supplier: "Green Valley",
    item: "Potatoes",
    amount: "₹1,200",
    status: "in-progress",
  },
]

const recentComplaints = [
  { id: "CMP-001", user: "Rajesh Kumar", type: "Vendor", issue: "Late delivery", status: "open", priority: "high" },
  {
    id: "CMP-002",
    user: "Suresh Vegetables",
    type: "Supplier",
    issue: "Payment delay",
    status: "resolved",
    priority: "medium",
  },
  {
    id: "CMP-003",
    user: "Priya Sharma",
    type: "Vendor",
    issue: "Quality issue",
    status: "in-progress",
    priority: "high",
  },
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="opacity-90">Monitor and manage the SathiBazaar platform</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,230</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest group orders on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{order.id}</span>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.vendor} → {order.supplier}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.item} • {order.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Complaints */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Support tickets requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{complaint.id}</span>
                        <Badge
                          variant={
                            complaint.priority === "high"
                              ? "destructive"
                              : complaint.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {complaint.priority}
                        </Badge>
                        <Badge
                          variant={
                            complaint.status === "resolved"
                              ? "default"
                              : complaint.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {complaint.user} ({complaint.type})
                      </p>
                      <p className="text-sm text-gray-500">{complaint.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Gateway</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">New Orders</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">New Vendors</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Groups</span>
                  <span className="font-semibold">18</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">3 pending complaints</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">1 high priority issue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Revenue up 15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
