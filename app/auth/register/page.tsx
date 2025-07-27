"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { toast } = useToast();
  const { verifyOtp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"vendor" | "supplier">("vendor");
  const [userId, setUserId] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    console.log("RegisterPage: handleRegister called with", { fullName, businessName, email, phone, role: activeTab });
    setIsLoading(true);
    try {
      const userData = {
        role: activeTab,
        email,
        phone,
        password,
        ...(activeTab === "vendor" ? { fullName } : { businessName, contactPerson: fullName }),
      };
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        setIsOtpSent(true);
        setUserId(data.userId);
        toast({
          title: "Registration Successful!",
          description: "Please check your email for the OTP.",
        });
      } else {
        console.error("RegisterPage: Registration failed:", data);
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("RegisterPage: Registration error:", error);
      toast({
        title: "Error",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("RegisterPage: handleVerifyOtp called with", { userId, otp });
    setIsLoading(true);
    try {
      await verifyOtp(userId, otp);
      toast({
        title: "Verification Successful!",
        description: "Your account has been verified.",
      });
    } catch (error) {
      console.error("RegisterPage: OTP verification error:", error);
      toast({
        title: "Verification Failed",
        description: (error as Error).message || "Invalid OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-xl border-blue-200 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="h-10 w-10 text-blue-600 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-900">SathiBazaar</h1>
          </div>
          <CardTitle className="text-2xl font-semibold text-blue-700">
            {isOtpSent ? "Verify Your Account" : "Register"}
          </CardTitle>
          <CardDescription>
            {isOtpSent
              ? "Enter the OTP sent to your email to verify your account."
              : "Create your account by selecting your role."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isOtpSent ? (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "vendor" | "supplier")} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-blue-100">
                <TabsTrigger value="vendor" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Vendor
                </TabsTrigger>
                <TabsTrigger value="supplier" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Supplier
                </TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <form onSubmit={handleRegister} className="space-y-4">
                  {activeTab === "supplier" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          type="text"
                          placeholder="Your business name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          required
                          className="border-blue-300 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Contact Person</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Contact person's full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="border-blue-300 focus:border-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="border-blue-300 focus:border-blue-500"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={activeTab === "admin" ? "admin@example.com" : `${activeTab}@example.com`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border-blue-300 focus:border-blue-500"
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
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    disabled={isLoading}
                    onClick={() => console.log("RegisterPage: Register button clicked")}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                disabled={isLoading}
                onClick={() => console.log("RegisterPage: Verify OTP button clicked")}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline text-blue-600 hover:text-blue-700">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}