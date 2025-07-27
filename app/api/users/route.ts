import { NextResponse } from "next/server"
import { users } from "@/lib/db"

export async function GET() {
  // In a real app, you might filter out sensitive data like passwords
  const usersWithoutPasswords = users.map(({ password, ...rest }) => rest)
  return NextResponse.json(usersWithoutPasswords, { status: 200 })
}

export async function PUT(request: Request) {
  const { id, ...updatedData } = await request.json()

  const userIndex = users.findIndex((u) => u.id === id)

  if (userIndex === -1) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  users[userIndex] = { ...users[userIndex], ...updatedData }
  const { password, ...userWithoutPassword } = users[userIndex] // Don't return password
  return NextResponse.json(userWithoutPassword, { status: 200 })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()

  const initialLength = users.length
  const filteredUsers = users.filter((u) => u.id !== id)

  if (filteredUsers.length === initialLength) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  // Update the in-memory array (simulating deletion)
  users.splice(0, users.length, ...filteredUsers)

  return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
}
