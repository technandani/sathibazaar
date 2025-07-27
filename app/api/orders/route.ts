import { NextResponse } from "next/server"
import { orders, generateId } from "@/lib/db"

export async function GET() {
  return NextResponse.json(orders, { status: 200 })
}

export async function POST(request: Request) {
  const { item, quantity, totalAmount, vendor, supplier, status, date, vendorId, supplierId } = await request.json()

  if (!item || !quantity || !totalAmount || !vendor || !supplier || !status || !date || !vendorId || !supplierId) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  const newOrder = {
    id: generateId("GO", orders.length),
    item,
    quantity,
    totalAmount,
    vendor,
    supplier,
    status,
    date,
    vendorId,
    supplierId,
  }

  orders.push(newOrder)
  return NextResponse.json(newOrder, { status: 201 })
}

export async function PUT(request: Request) {
  const { id, ...updatedData } = await request.json()

  const orderIndex = orders.findIndex((o) => o.id === id)

  if (orderIndex === -1) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 })
  }

  orders[orderIndex] = { ...orders[orderIndex], ...updatedData }
  return NextResponse.json(orders[orderIndex], { status: 200 })
}