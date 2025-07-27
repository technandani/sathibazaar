"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, Edit, Trash2, Search } from "lucide-react"
import SupplierLayout from "@/components/supplier-layout"
import { useToast } from "@/components/ui/use-toast"

type Product = {
  id: string
  name: string
  unitPrice: number
  unit: string
  availability: "In Stock" | "Out of Stock" | "Limited"
  locationServed: string
}

const initialProducts: Product[] = [
  { id: "P-001", name: "Onions", unitPrice: 28, unit: "kg", availability: "In Stock", locationServed: "Delhi NCR" },
  { id: "P-002", name: "Tomatoes", unitPrice: 42, unit: "kg", availability: "Limited", locationServed: "Delhi NCR" },
  { id: "P-003", name: "Potatoes", unitPrice: 20, unit: "kg", availability: "In Stock", locationServed: "Delhi NCR" },
  {
    id: "P-004",
    name: "Green Chili",
    unitPrice: 75,
    unit: "kg",
    availability: "In Stock",
    locationServed: "Delhi NCR",
  },
  {
    id: "P-005",
    name: "Cabbage",
    unitPrice: 22,
    unit: "piece",
    availability: "Out of Stock",
    locationServed: "Delhi NCR",
  },
]

export default function SupplierProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [productName, setProductName] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [unit, setUnit] = useState("kg")
  const [availability, setAvailability] = useState<Product["availability"]>("In Stock")
  const [locationServed, setLocationServed] = useState("Delhi NCR")

  const [searchTerm, setSearchTerm] = useState("")
  const [filterAvailability, setFilterAvailability] = useState("All")

  const handleAddOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName || !unitPrice || !unit || !locationServed) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: productName,
                unitPrice: Number.parseFloat(unitPrice),
                unit,
                availability,
                locationServed,
              }
            : p,
        ),
      )
      toast({
        title: "Product Updated!",
        description: `${productName} has been updated successfully.`,
      })
    } else {
      const newProduct: Product = {
        id: `P-${(products.length + 1).toString().padStart(3, "0")}`,
        name: productName,
        unitPrice: Number.parseFloat(unitPrice),
        unit,
        availability,
        locationServed,
      }
      setProducts([...products, newProduct])
      toast({
        title: "Product Added!",
        description: `${productName} has been added to your product list.`,
      })
    }
    resetForm()
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setProductName(product.name)
    setUnitPrice(product.unitPrice.toString())
    setUnit(product.unit)
    setAvailability(product.availability)
    setLocationServed(product.locationServed)
  }

  const handleDeleteClick = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    toast({
      title: "Product Deleted!",
      description: "The product has been removed.",
    })
  }

  const resetForm = () => {
    setEditingProduct(null)
    setProductName("")
    setUnitPrice("")
    setUnit("kg")
    setAvailability("In Stock")
    setLocationServed("Delhi NCR")
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterAvailability === "All" || product.availability === filterAvailability),
  )

  const getAvailabilityBadgeVariant = (availability: Product["availability"]) => {
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

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Product Management</h1>
          <p className="text-gray-600">Add, edit, and manage your raw material products.</p>
        </div>

        {/* Add/Edit Product Form */}
        <Card>
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
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
                {editingProduct && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card>
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
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        No products found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
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
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              title="Delete Product"
                              onClick={() => handleDeleteClick(product.id)}
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
    </SupplierLayout>
  )
}
