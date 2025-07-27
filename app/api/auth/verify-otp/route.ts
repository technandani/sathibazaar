import { NextResponse } from "next/server"
import { users, otpStore } from "@/lib/db"

export async function POST(request: Request) {
  const { email, otp } = await request.json()

  if (!email || !otp) {
    return NextResponse.json({ message: "Missing email or OTP" }, { status: 400 })
  }

  const storedOtpData = otpStore.get(email)

  if (!storedOtpData || storedOtpData.otp !== otp || storedOtpData.expires < Date.now()) {
    return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 })
  }

  // OTP is valid, verify the user
  const user = users.find((u) => u.email === email)
  if (user) {
    user.verification = "Verified"
    otpStore.delete(email) // Clear OTP after successful verification
    return NextResponse.json({ message: "OTP verified successfully. User is now verified." }, { status: 200 })
  }

  return NextResponse.json({ message: "User not found" }, { status: 404 })
}