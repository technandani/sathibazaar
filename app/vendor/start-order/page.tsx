"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Package } from "lucide-react"
import VendorLayout from "@/components/vendor-layout"

const products = [
  { value: "onions", label: "Onions", unit: "kg", basePrice: 30 },
  { value: "tomatoes", label: "Tomatoes", unit: "kg", basePrice: 45 },
  { value: "potatoes", label: "Potatoes", unit: "kg", basePrice: 22 },
  { value: "carrots", label: "Carrots", unit: "kg", basePrice: 35 },
  { value: "cabbage", label: "Cabbage", unit: "piece", basePrice: 25 },
  { value: "green-chili", label: "Green Chili", unit: "kg", basePrice: 80 },
]

const pickupTimes = [
  "6:00 AM - 8:00 AM",
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
]

export default function StartGroupOrder() {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [notes, setNotes] = useState("")

  const selectedProductData = products.find((p) => p.value === selectedProduct)
  const estimatedPrice =
    selectedProductData && quantity ? (selectedProductData.basePrice * Number.parseInt(quantity)).toFixed(2) : "0"

  return (
    <VendorLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Start New Group Order</h1>
          <p className="text-gray-600">Create a group order and invite other vendors to join for bulk discounts.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Details
            </CardTitle>
            <CardDescription>Fill in the details for your group order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product">Select Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.value} value={product.value}>
                      {product.label} (₹{product.basePrice}/{product.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Needed</Label>
              <div className="flex space-x-2">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <div className="flex items-center px-3 bg-gray-100 rounded-md">
                  <span className="text-sm text-gray-600">{selectedProductData?.unit || "unit"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup-time">Preferred Pickup Time</Label>
              <Select value={pickupTime} onValueChange={setPickupTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup time" />
                </SelectTrigger>
                <SelectContent>
                  {pickupTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {selectedProduct && quantity && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>₹{estimatedPrice}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Expected Savings (15-25%):</span>
                      <span>₹{(Number.parseFloat(estimatedPrice) * 0.2).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Estimated Final Price:</span>
                      <span>₹{(Number.parseFloat(estimatedPrice) * 0.8).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                Save as Draft
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700">Create Group Order</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How Group Orders Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-green-600">1</span>
                </div>
                <p>Your order will be visible to nearby vendors for 24 hours</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-green-600">2</span>
                </div>
                <p>As more vendors join, the price automatically decreases</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-green-600">3</span>
                </div>
                <p>Once minimum quantity is reached, the order is sent to suppliers</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-green-600">4</span>
                </div>
                <p>Pickup your order at the designated time and location</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  )
}
