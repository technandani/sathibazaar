import { NextResponse } from "next/server"
import { users, otpStore, generateId } from "@/lib/db"

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json()

  if (!name || !email || !password || !role) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  if (users.some((user) => user.email === email)) {
    return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
  }

  // Simulate OTP generation and sending
  const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
  const otpExpires = Date.now() + 5 * 60 * 1000 // OTP valid for 5 minutes

  // Store OTP temporarily
  otpStore.set(email, { otp, expires: otpExpires })

  // In a real application, you would send this OTP via email or SMS.
  // For this Next.js environment, we'll log it to the console.
  console.log(`OTP for ${email}: ${otp}`)

  // Temporarily store user data, mark as unverified
  const newUser = {
    id: generateId("USR", users.length),
    name,
    email,
    password, // In a real app, hash this password!
    role,
    status: "Active",
    verification: "Unverified",
    lastLogin: new Date().toISOString().split("T")[0],
  }
  users.push(newUser)

  return NextResponse.json(
    { message: "User registered. OTP sent to console for verification.", userId: newUser.id },
    { status: 200 },
  )
}
