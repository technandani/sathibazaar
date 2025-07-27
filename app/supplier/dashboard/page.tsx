import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, TrendingUp, Clock, Star, Package, Users } from "lucide-react"
import SupplierLayout from "@/components/supplier-layout"

const todayOrders = [
  { id: 1, item: "Onions", quantity: "150 kg", vendors: 8, area: "Karol Bagh", status: "pending" },
  { id: 2, item: "Tomatoes", quantity: "200 kg", vendors: 12, area: "Lajpat Nagar", status: "accepted" },
  { id: 3, item: "Potatoes", quantity: "100 kg", vendors: 6, area: "Chandni Chowk", status: "delivered" },
]

const mostRequested = [
  { item: "Onions", requests: 45, trend: "+12%" },
  { item: "Tomatoes", requests: 38, trend: "+8%" },
  { item: "Potatoes", requests: 32, trend: "+15%" },
  { item: "Green Chili", requests: 28, trend: "+5%" },
]

export default function SupplierDashboard() {
  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Suresh!</h1>
          <p className="opacity-90">You have 3 new group orders waiting for your response.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹15,240</div>
              <p className="text-xs text-muted-foreground">+20% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">26</div>
              <p className="text-xs text-muted-foreground">Ordering today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Group Orders</CardTitle>
              <CardDescription>Orders requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{order.item}</span>
                        <Badge
                          variant={
                            order.status === "pending"
                              ? "secondary"
                              : order.status === "accepted"
                                ? "default"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.quantity} • {order.vendors} vendors • {order.area}
                      </p>
                    </div>
                    {order.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Decline
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Requested Items */}
          <Card>
            <CardHeader>
              <CardTitle>Most Requested Items</CardTitle>
              <CardDescription>Popular items this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mostRequested.map((item, index) => (
                  <div key={item.item} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-gray-600">{item.requests} requests</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {item.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 bg-blue-600 hover:bg-blue-700">
                <div className="text-center">
                  <Package className="h-6 w-6 mx-auto mb-2" />
                  <span>Add New Product</span>
                </div>
              </Button>
              <Button variant="outline" className="h-20 bg-transparent">
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2" />
                  <span>Update Delivery Schedule</span>
                </div>
              </Button>
              <Button variant="outline" className="h-20 bg-transparent">
                <div className="text-center">
                  <Star className="h-6 w-6 mx-auto mb-2" />
                  <span>View Reviews</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  )
}
