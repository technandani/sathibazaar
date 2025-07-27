"use client"

import Image from "next/image"
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, Edit, Trash2, Search, Loader2 } from "lucide-react"
import SupplierLayout from "@/components/supplier-layout"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Product as ProductType } from "@/lib/db" // Import ProductType from lib/db

export default function SupplierProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<ProductType[]>([])
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null)

  const [productName, setProductName] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [unit, setUnit] = useState("kg")
  const [availability, setAvailability] = useState<ProductType["availability"]>("In Stock")
  const [locationServed, setLocationServed] = useState("Delhi NCR")
  const [productImageFile, setProductImageFile] = useState<File | null>(null) // For file input
  const [productImageUrl, setProductImageUrl] = useState("") // For displaying and saving URL

  const [searchTerm, setSearchTerm] = useState("")
  const [filterAvailability, setFilterAvailability] = useState("All")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null)
  const [currentSupplierName, setCurrentSupplierName] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would come from a session or auth context
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (user && user.id && user.role === "Supplier") {
      setCurrentSupplierId(user.id)
      setCurrentSupplierName(user.name)
      fetchProducts(user.id)
    } else {
      toast({
        title: "Authentication Error",
        description: "Please log in as a supplier to manage products.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [])

  const fetchProducts = async (supplierId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data: ProductType[] = await response.json()
        // Filter products by the current supplier
        setProducts(data.filter((p) => p.supplierId === supplierId))
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch products.",
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
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (): Promise<string | null> => {
    if (!productImageFile) return productImageUrl || null // Return existing URL if no new file

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("file", productImageFile)

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Image Uploaded!",
          description: "Product image uploaded successfully.",
        })
        return data.imageUrl
      } else {
        toast({
          title: "Image Upload Failed",
          description: data.message || "Could not upload image.",
          variant: "destructive",
        })
        return null
      }
    } catch (error) {
      console.error("Image upload error:", error)
      toast({
        title: "Error",
        description: "Could not connect to image upload service.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName || !unitPrice || !unit || !locationServed || !currentSupplierId || !currentSupplierName) {
      toast({
        title: "Error",
        description: "Please fill all required fields and ensure you are logged in as a supplier.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const uploadedImageUrl = await handleImageUpload()
    if (productImageFile && !uploadedImageUrl) {
      setIsSubmitting(false)
      return // Stop if image upload failed
    }

    const finalImageUrl =
      uploadedImageUrl || productImageUrl || `/placeholder.svg?height=50&width=50&query=${productName.toLowerCase()}`

    const productData = {
      name: productName,
      unitPrice: Number.parseFloat(unitPrice),
      unit,
      availability,
      locationServed,
      image: finalImageUrl,
      supplierId: currentSupplierId,
      supplierName: currentSupplierName,
    }

    try {
      let response
      if (editingProduct) {
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
      } else {
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
      }

      const data = await response.json()
      if (response.ok) {
        toast({
          title: editingProduct ? "Product Updated!" : "Product Added!",
          description: `${productName} has been ${editingProduct ? "updated" : "added"} successfully.`,
        })
        if (currentSupplierId) {
          fetchProducts(currentSupplierId) // Re-fetch products to update list
        }
        resetForm()
      } else {
        toast({
          title: "Operation Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Product operation error:", error)
      toast({
        title: "Error",
        description: "Could not connect to the server.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (product: ProductType) => {
    setEditingProduct(product)
    setProductName(product.name)
    setUnitPrice(product.unitPrice.toString())
    setUnit(product.unit)
    setAvailability(product.availability)
    setLocationServed(product.locationServed)
    setProductImageUrl(product.image) // Set current image URL for display
    setProductImageFile(null) // Clear file input
  }

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Product Deleted!",
          description: data.message,
        })
        if (currentSupplierId) {
          fetchProducts(currentSupplierId)
        }
      } else {
        toast({
          title: "Deletion Failed",
          description: data.message || "Something went wrong during deletion.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Product deletion error:", error)
      toast({
        title: "Error",
        description: "Could not connect to the server for deletion.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setProductToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setProductName("")
    setUnitPrice("")
    setUnit("kg")
    setAvailability("In Stock")
    setLocationServed("Delhi NCR")
    setProductImageFile(null)
    setProductImageUrl("")
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterAvailability === "All" || product.availability === filterAvailability),
  )

  const getAvailabilityBadgeVariant = (availability: ProductType["availability"]) => {
    switch (availability) {
      case "In Stock":
        return "default"
      case "Out of Stock":
        return "destructive"
      case "Limited":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <SupplierLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading products...</span>
        </div>
      </SupplierLayout>
    )
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Product Management</h1>
          <p className="text-gray-600">Add, edit, and manage your raw material products.</p>
        </div>

        {/* Add/Edit Product Form */}
        <Card className="shadow-sm border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              {editingProduct ? "Edit Product" : "Add New Product"}
            </CardTitle>
            <CardDescription>Fill in the details for your product.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit-price">Unit Price (₹)</Label>
                  <Input
                    id="unit-price"
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="piece">piece</SelectItem>
                      <SelectItem value="dozen">dozen</SelectItem>
                      <SelectItem value="bag">bag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location-served">Location Served</Label>
                  <Input
                    id="location-served"
                    value={locationServed}
                    onChange={(e) => setLocationServed(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-image">Product Image</Label>
                <Input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductImageFile(e.target.files ? e.target.files[0] : null)}
                />
                {(productImageFile || productImageUrl) && (
                  <div className="mt-2">
                    <Image
                      src={productImageFile ? URL.createObjectURL(productImageFile) : productImageUrl}
                      alt="Product Preview"
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-md" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
                {editingProduct && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="bg-transparent"
                    disabled={isSubmitting}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Your Products
            </CardTitle>
            <CardDescription>A list of all your products available on SathiBazaar.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2 sm:space-y-0">
                <Label htmlFor="availability-filter" className="sr-only">
                  Filter by Availability
                </Label>
                <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                  <SelectTrigger id="availability-filter">
                    <SelectValue placeholder="All Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Availability</SelectItem>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Limited">Limited</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Location Served</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">
                        No products found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>₹{product.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>
                          <Badge variant={getAvailabilityBadgeVariant(product.availability)}>
                            {product.availability}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.locationServed}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              title="Edit Product"
                              onClick={() => handleEditClick(product)}
                              disabled={isSubmitting}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              title="Delete Product"
                              onClick={() => handleDeleteClick(product.id)}
                              disabled={isSubmitting}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SupplierLayout>
  )
}
