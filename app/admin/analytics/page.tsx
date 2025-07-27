import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, LineChart, PieChart, Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react"
import AdminLayout from "@/components/admin-layout"

// Placeholder for a simple chart component
const ChartPlaceholder = ({ title, type }: { title: string; type: string }) => (
  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed text-gray-400">
    {type === "bar" && <BarChart3 className="h-12 w-12 mb-2" />}
    {type === "line" && <LineChart className="h-12 w-12 mb-2" />}
    {type === "pie" && <PieChart className="h-12 w-12 mb-2" />}
    <p className="text-lg font-semibold">{title}</p>
    <p className="text-sm">Chart data goes here (e.g., using Recharts or Chart.js)</p>
  </div>
)

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Gain insights into platform usage, performance, and trends.</p>
        </div>

        {/* Key Performance Indicators */}
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
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,800</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,230</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,500</div>
              <p className="text-xs text-muted-foreground">Stable over last quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Orders</CardTitle>
              <CardDescription>Number of group orders placed each month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title="Monthly Orders Chart" type="bar" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New vendor and supplier registrations over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title="User Growth Chart" type="line" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Products by Quantity</CardTitle>
              <CardDescription>Most frequently ordered raw materials.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title="Top Products Chart" type="pie" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by User Type</CardTitle>
              <CardDescription>Breakdown of earnings from vendors vs. suppliers.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title="Revenue Breakdown Chart" type="pie" />
            </CardContent>
          </Card>
        </div>

        {/* Filters for Charts (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Chart Filters</CardTitle>
            <CardDescription>Apply filters to customize your analytics view.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Input id="date-range" type="text" placeholder="e.g., Last 30 days, Custom" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location-filter">Location</Label>
              <Input id="location-filter" type="text" placeholder="e.g., Delhi, Mumbai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-filter">Product Category</Label>
              <Input id="product-filter" type="text" placeholder="e.g., Vegetables, Grains" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
