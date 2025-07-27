"use client"

import { useState } from "react"
import VendorLayout from "@/components/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ShoppingCart, PlusCircle, ListOrdered, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Product = {
  id: string
  name: string
  unitPrice: number
  unit: string
  supplier: string
}

type OrderItem = Product & {
  quantity: number
  totalPrice: number
}

const availableProducts: Product[] = [
  { id: "prod-001", name: "Onions", unitPrice: 30, unit: "kg", supplier: "Suresh Vegetables" },
  { id: "prod-002", name: "Tomatoes", unitPrice: 45, unit: "kg", supplier: "Fresh Mart" },
  { id: "prod-003", name: "Potatoes", unitPrice: 25, unit: "kg", supplier: "Green Valley Farms" },
  { id: "prod-004", name: "Ginger", unitPrice: 80, unit: "kg", supplier: "Suresh Vegetables" },
  { id: "prod-005", name: "Cabbage", unitPrice: 20, unit: "piece", supplier: "Fresh Mart" },
  { id: "prod-006", name: "Spinach", unitPrice: 15, unit: "bunch", supplier: "Green Valley Farms" },
]

export default function StartOrderPage() {
  const { toast } = useToast()
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<string>("")
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [isOrderReviewOpen, setIsOrderReviewOpen] = useState(false)

  const selectedProduct = availableProducts.find((p) => p.id === selectedProductId)

  const handleAddProductToOrder = () => {
    if (!selectedProduct || !quantity || Number(quantity) <= 0) {
      toast({
        title: "Error",
        description: "Please select a product and enter a valid quantity.",
        variant: "destructive",
      })
      return
    }

    const qty = Number(quantity)
    const totalPrice = qty * selectedProduct.unitPrice

    const newItem: OrderItem = {
      ...selectedProduct,
      quantity: qty,
      totalPrice: totalPrice,
    }

    setCurrentOrder((prevOrder) => {
      const existingItemIndex = prevOrder.findIndex((item) => item.id === newItem.id)
      if (existingItemIndex > -1) {
        const updatedOrder = [...prevOrder]
        updatedOrder[existingItemIndex] = {
          ...updatedOrder[existingItemIndex],
          quantity: updatedOrder[existingItemIndex].quantity + newItem.quantity,
          totalPrice: updatedOrder[existingItemIndex].totalPrice + newItem.totalPrice,
        }
        return updatedOrder
      }
      return [...prevOrder, newItem]
    })

    toast({
      title: "Product Added!",
      description: `${qty} ${selectedProduct.unit}(s) of ${selectedProduct.name} added to your order.`,
    })

    setSelectedProductId(null)
    setQuantity("")
  }

  const handleRemoveItem = (productId: string) => {
    setCurrentOrder((prevOrder) => prevOrder.filter((item) => item.id !== productId))
    toast({
      title: "Item Removed!",
      description: "Product removed from your order.",
    })
  }

  const handlePlaceOrder = () => {
    if (currentOrder.length === 0) {
      toast({
        title: "Error",
        description: "Your order is empty. Please add products before placing an order.",
        variant: "destructive",
      })
      return
    }

    // Simulate order placement
    console.log("Placing order:", currentOrder)
    toast({
      title: "Order Placed!",
      description: "Your group order has been successfully placed.",
      action: <Button variant="outline">View Orders</Button>, // Example action
    })
    setCurrentOrder([]) // Clear the order after placing
    setIsOrderReviewOpen(false)
  }

  const totalOrderAmount = currentOrder.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Start New Group Order</h1>
          <p className="text-gray-600">Select products and quantities to create a new group order.</p>
        </div>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Select Products
            </CardTitle>
            <CardDescription>Choose items and specify quantities for your order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-select">Product</Label>
                <Select value={selectedProductId || ""} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="product-select">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (₹{product.unitPrice}/{product.unit}) - {product.supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity-input">Quantity ({selectedProduct?.unit || "units"})</Label>
                <Input
                  id="quantity-input"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 10"
                  min="1"
                  disabled={!selectedProductId}
                />
              </div>
            </div>
            <Button onClick={handleAddProductToOrder} disabled={!selectedProductId || !quantity}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add to Order
            </Button>
          </CardContent>
        </Card>

        {/* Current Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListOrdered className="h-5 w-5 mr-2" />
              Your Current Order
            </CardTitle>
            <CardDescription>Review items added to your order before placing.</CardDescription>
          </CardHeader>
          <CardContent>
            {currentOrder.length === 0 ? (
              <p className="text-gray-500">No items in your current order. Add some products above!</p>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrder.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>
                          ₹{item.unitPrice.toFixed(2)}/{item.unit}
                        </TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>₹{item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.id)}>
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center font-bold text-lg pt-4 border-t">
                  <span>Total Amount:</span>
                  <span>₹{totalOrderAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsOrderReviewOpen(true)}
                    disabled={currentOrder.length === 0}
                  >
                    <ListOrdered className="h-4 w-4 mr-2" />
                    Review Order
                  </Button>
                  <Button onClick={handlePlaceOrder} disabled={currentOrder.length === 0}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Review Dialog */}
      <Dialog open={isOrderReviewOpen} onOpenChange={setIsOrderReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Your Order</DialogTitle>
            <DialogDescription>Please review the items in your cart before placing the order.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrder.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>₹{item.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center font-bold text-lg pt-4 border-t">
            <span>Total:</span>
            <span>₹{totalOrderAmount.toFixed(2)}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderReviewOpen(false)}>
              Edit Order
            </Button>
            <Button onClick={handlePlaceOrder}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VendorLayout>
  )
}
