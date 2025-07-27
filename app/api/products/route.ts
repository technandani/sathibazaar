import { NextResponse } from "next/server"
import { products, generateId } from "@/lib/db"

export async function GET() {
  return NextResponse.json(products, { status: 200 })
}

export async function POST(request: Request) {
  const { name, unitPrice, unit, availability, locationServed, image, supplierId, supplierName } = await request.json()

  if (!name || !unitPrice || !unit || !availability || !locationServed || !supplierId || !supplierName) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  const newProduct = {
    id: generateId("P", products.length),
    name,
    unitPrice: Number(unitPrice),
    unit,
    availability,
    locationServed,
    image: image || `/placeholder.svg?height=50&width=50&query=${name.toLowerCase()}`,
    supplierId,
    supplierName,
  }

  products.push(newProduct)
  return NextResponse.json(newProduct, { status: 201 })
}