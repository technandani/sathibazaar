"use client"

import { useState, useEffect } from "react"
import VendorLayout from "@/components/vendor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ShoppingCart, PlusCircle, ListOrdered, Loader2 } from "lucide-react"
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
import type { Product as ProductType, Order as OrderType } from "@/lib/db"

type OrderItem = ProductType & {
  quantity: number
  totalPrice: number
}

const pickupTimes = [
  "6:00 AM - 8:00 AM",
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
]

export default function StartOrderPage() {
  const { toast } = useToast()
  const [availableProducts, setAvailableProducts] = useState<ProductType[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<string>("")
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [isOrderReviewOpen, setIsOrderReviewOpen] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null)
  const [currentVendorName, setCurrentVendorName] = useState<string | null>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (user && user.id && user.role === "Vendor") {
      setCurrentVendorId(user.id)
      setCurrentVendorName(user.name)
      fetchProducts()
    } else {
      toast({
        title: "Authentication Error",
        description: "Please log in as a vendor to start orders.",
        variant: "destructive",
      })
      setIsLoadingProducts(false)
    }
  }, [])

  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data: ProductType[] = await response.json()
        setAvailableProducts(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch available products.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast({
        title: "Error",
        description: "Could not connect to the server to fetch products.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProducts(false)
    }
  }

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

  const handlePlaceOrder = async () => {
    if (currentOrder.length === 0) {
      toast({
        title: "Error",
        description: "Your order is empty. Please add products before placing an order.",
        variant: "destructive",
      })
      return
    }
    if (!currentVendorId || !currentVendorName) {
      toast({
        title: "Authentication Error",
        description: "Vendor information missing. Please log in again.",
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)
    try {
      // For simplicity, we'll create one order entry per item in the currentOrder
      // In a real app, you might aggregate this into a single group order with multiple items
      for (const item of currentOrder) {
        const newOrder: Partial<OrderType> = {
          item: item.name,
          quantity: `${item.quantity} ${item.unit}`,
          totalAmount: `₹${item.totalPrice.toFixed(2)}`,
          vendor: currentVendorName,
          supplier: item.supplierName, // Use supplier name from product
          status: "Pending", // Initial status
          date: new Date().toISOString().split("T")[0],
          vendorId: currentVendorId,
          supplierId: item.supplierId,
        }

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Failed to place order for ${item.name}`)
        }
      }

      toast({
        title: "Order Placed!",
        description: "Your group order(s) have been successfully placed.",
        action: <Button variant="outline">View Orders</Button>,
      })
      setCurrentOrder([]) // Clear the order after placing
      setIsOrderReviewOpen(false)
    } catch (error: any) {
      console.error("Error placing order:", error)
      toast({
        title: "Order Placement Failed",
        description: error.message || "Something went wrong while placing your order.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const totalOrderAmount = currentOrder.reduce((sum, item) => sum + item.totalPrice, 0)

  if (isLoadingProducts) {
    return (
      <VendorLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <span className="ml-2 text-lg">Loading products...</span>
        </div>
      </VendorLayout>
    )
  }

  return (
    <VendorLayout>
      <div className="max-w-2xl mx-auto space-y-6">
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
                        {product.name} (₹{product.unitPrice}/{product.unit}) - {product.supplierName}
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
            <Button onClick={handleAddProductToOrder} disabled={!selectedProductId || !quantity || isPlacingOrder}>
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
                        <TableCell>{item.supplierName}</TableCell>
                        <TableCell>
                          ₹{item.unitPrice.toFixed(2)}/{item.unit}
                        </TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>₹{item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isPlacingOrder}
                          >
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
                    disabled={currentOrder.length === 0 || isPlacingOrder}
                  >
                    <ListOrdered className="h-4 w-4 mr-2" />
                    Review Order
                  </Button>
                  <Button onClick={handlePlaceOrder} disabled={currentOrder.length === 0 || isPlacingOrder}>
                    {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                    <TableCell>{item.supplierName}</TableCell>
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
            <Button variant="outline" onClick={() => setIsOrderReviewOpen(false)} disabled={isPlacingOrder}>
              Edit Order
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isPlacingOrder}>
              {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VendorLayout>
  )
}
