import { NextResponse } from "next/server"
import { complaints, generateId } from "@/lib/db"

export async function GET() {
  return NextResponse.json(complaints, { status: 200 })
}

export async function POST(request: Request) {
  const { user, userType, issue, status, priority, date, userId } = await request.json()

  if (!user || !userType || !issue || !status || !priority || !date || !userId) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  const newComplaint = {
    id: generateId("CMP", complaints.length),
    user,
    userType,
    issue,
    status,
    priority,
    date,
    userId,
  }

  complaints.push(newComplaint)
  return NextResponse.json(newComplaint, { status: 201 })
}

export async function PUT(request: Request) {
  const { id, ...updatedData } = await request.json()

  const complaintIndex = complaints.findIndex((c) => c.id === id)

  if (complaintIndex === -1) {
    return NextResponse.json({ message: "Complaint not found" }, { status: 404 })
  }

  complaints[complaintIndex] = { ...complaints[complaintIndex], ...updatedData }
  return NextResponse.json(complaints[complaintIndex], { status: 200 })
}