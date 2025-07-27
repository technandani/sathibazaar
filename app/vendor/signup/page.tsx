"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function VendorSignupPage() {
  const { toast } = useToast()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [resendDisabled, setResendDisabled] = useState(true)

  const startCountdown = () => {
    setCountdown(60)
    setResendDisabled(true)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }
    // Simulate registration and OTP sending
    setIsVerifying(true)
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString() // 4-digit OTP
    setGeneratedOtp(newOtp)
    setOtpSent(true)
    startCountdown()

    toast({
      title: "OTP Sent!",
      description: `A 4-digit OTP has been sent to your email/phone. (Simulated OTP: ${newOtp})`,
    })
  }

  const handleVerifyOtp = async () => {
    if (otp === generatedOtp) {
      setIsVerified(true)
      setIsVerifying(false)
      toast({
        title: "Verification Successful!",
        description: "Your account has been verified.",
        variant: "default",
      })
      // In a real app, you'd now send the user data to your backend to finalize registration
      console.log("Vendor Registered and Verified:", { fullName, email, phone, password })
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResendOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString()
    setGeneratedOtp(newOtp)
    startCountdown()
    toast({
      title: "OTP Resent!",
      description: `A new OTP has been sent. (Simulated OTP: ${newOtp})`,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg border-green-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">SathiBazaar</h1>
          </div>
          <CardTitle className="text-2xl font-semibold text-green-700">Vendor Sign Up</CardTitle>
          <CardDescription>Create your account to start saving on raw materials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!otpSent ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Rajesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.rajesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                Register & Send OTP
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-700 mb-2">
                  An OTP has been sent to <span className="font-semibold">{email}</span>. Please enter it below to
                  verify your account.
                </p>
                {isVerified ? (
                  <div className="flex items-center justify-center text-green-600 font-semibold">
                    <CheckCircle className="h-5 w-5 mr-2" /> Account Verified!
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="XXXX"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={4}
                      required
                    />
                    <Button onClick={handleVerifyOtp} className="w-full bg-green-600 hover:bg-green-700">
                      Verify OTP
                    </Button>
                    <div className="text-center text-sm text-gray-600 mt-2">
                      {resendDisabled ? (
                        <span>Resend OTP in {countdown}s</span>
                      ) : (
                        <Button
                          variant="link"
                          onClick={handleResendOtp}
                          className="text-green-600 hover:text-green-700"
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/vendor/login" className="underline text-green-600 hover:text-green-700">
              Login as Vendor
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
