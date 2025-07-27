"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SupplierLayout from "@/components/supplier-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SupplierProductsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [availability, setAvailability] = useState("In Stock");
  const [locationServed, setLocationServed] = useState("Delhi NCR");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("All");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.filter((p: any) => p.supplierId._id === user?.id));
        } else {
          toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
      }
    };
    if (user) fetchProducts();
  }, [user, toast]);

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !unitPrice || !unit || !locationServed) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    try {
      let imageUrl = editingProduct?.image;
      if (productImage) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(productImage);
        });
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct?._id,
          name: productName,
          unitPrice,
          unit,
          availability,
          locationServed,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(
          editingProduct
            ? products.map((p) => (p._id === editingProduct._id ? data.product : p))
            : [...products, data.product]
        );
        toast({
          title: editingProduct ? "Product Updated!" : "Product Added!",
          description: `${productName} has been ${editingProduct ? "updated" : "added"}.`,
        });
        resetForm();
      } else {
        toast({ title: "Error", description: (await response.json()).message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const handleDeleteClick = async (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete }),
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productToDelete));
        toast({ title: "Product Deleted!", description: "The product has been removed." });
        setProductToDelete(null);
        setIsDeleteDialogOpen(false);
      } else {
        toast({ title: "Error", description: (await response.json()).message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setProductName("");
    setUnitPrice("");
    setUnit("kg");
    setAvailability("In Stock");
    setLocationServed("Delhi NCR");
    setProductImage(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterAvailability === "All" || product.availability === filterAvailability)
  );

  const getAvailabilityBadgeVariant = (availability: string) => {
    switch (availability) {
      case "In Stock":
        return "default";
      case "Out of Stock":
        return "destructive";
      case "Limited":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <ProtectedRoute role="supplier">
      <SupplierLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-600">Add, edit, and manage your raw material products.</p>
          </div>
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
                  <Input id="product-name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
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
                    onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                  />
                  {(productImage || editingProduct?.image) && (
                    <div className="mt-2">
                      <Image
                        src={productImage ? URL.createObjectURL(productImage) : editingProduct?.image || "/placeholder.svg"}
                        alt="Product Preview"
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-md">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  {editingProduct && (
                    <Button type="button" variant="outline" onClick={resetForm} className="bg-transparent">
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
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
                        <TableRow key={product._id}>
                          <TableCell>
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product._id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>₹{product.unitPrice.toFixed(2)}</TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell>
                            <Badge variant={getAvailabilityBadgeVariant(product.availability)}>{product.availability}</Badge>
                          </TableCell>
                          <TableCell>{product.locationServed}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                title="Edit Product"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductName(product.name);
                                  setUnitPrice(product.unitPrice.toString());
                                  setUnit(product.unit);
                                  setAvailability(product.availability);
                                  setLocationServed(product.locationServed);
                                  setProductImage(null);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                title="Delete Product"
                                onClick={() => handleDeleteClick(product._id)}
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
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently delete the product.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SupplierLayout>
    </ProtectedRoute>
  );
}