import { NextResponse } from "next/server"
import { products } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const updatedData = await request.json()

  const productIndex = products.findIndex((p) => p.id === id)

  if (productIndex === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  products[productIndex] = { ...products[productIndex], ...updatedData, unitPrice: Number(updatedData.unitPrice) }
  return NextResponse.json(products[productIndex], { status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  const initialLength = products.length
  const filteredProducts = products.filter((p) => p.id !== id)

  if (filteredProducts.length === initialLength) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  // Update the in-memory array (simulating deletion)
  products.splice(0, products.length, ...filteredProducts)

  return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
}
