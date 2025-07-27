import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, User } from "lucide-react"
import SupplierLayout from "@/components/supplier-layout"

const reviews = [
  {
    id: 1,
    vendorName: "Rajesh Kumar",
    rating: 5,
    comment: "Excellent quality onions and very prompt delivery! Highly recommend Suresh Vegetables.",
    date: "2024-07-25",
    product: "Onions",
  },
  {
    id: 2,
    vendorName: "Priya Sharma",
    rating: 4,
    comment: "Good tomatoes, but delivery was a bit late. Overall satisfied.",
    date: "2024-07-24",
    product: "Tomatoes",
  },
  {
    id: 3,
    vendorName: "Amit Singh",
    rating: 5,
    comment: "Always reliable and fresh produce. Great prices too!",
    date: "2024-07-20",
    product: "Potatoes",
  },
  {
    id: 4,
    vendorName: "Kiran Devi",
    rating: 3,
    comment: "The cabbage was okay, but some pieces were damaged. Needs improvement.",
    date: "2024-07-18",
    product: "Cabbage",
  },
]

export default function SupplierReviewsPage() {
  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Ratings & Feedback</h1>
          <p className="text-gray-600">View feedback from vendors about your products and service.</p>
        </div>

        {/* Overall Rating */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
            <Star className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-4xl font-bold">{averageRating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Number.parseInt(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs opacity-90 mt-1">Based on {reviews.length} reviews</p>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Vendor Reviews
            </CardTitle>
            <CardDescription>Detailed feedback from your customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center text-gray-500 p-6">No reviews yet.</div>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{review.vendorName}</h3>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">"{review.comment}"</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Product: {review.product}
                      </Badge>
                      {/* Placeholder for reply button */}
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  )
}
