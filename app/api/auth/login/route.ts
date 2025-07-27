import { NextResponse } from "next/server"
import { users } from "@/lib/db"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ message: "Missing email or password" }, { status: 400 })
  }

  const user = users.find((u) => u.email === email)

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  // In a real app, you would compare hashed passwords (e.g., bcrypt.compare)
  if (user.password !== password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }

  if (user.verification === "Unverified") {
    return NextResponse.json({ message: "Account not verified. Please verify your email." }, { status: 403 })
  }

  // Update last login (simulated)
  user.lastLogin = new Date().toISOString().split("T")[0]

  // In a real app, you would generate a JWT token here
  return NextResponse.json(
    {
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        verification: user.verification,
      },
    },
    { status: 200 },
  )
}