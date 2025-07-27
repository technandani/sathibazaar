"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function SupplierLoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        console.log("Login successful", data);
        // redirect or show success
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">SathiBazaar</h1>
          </div>
          <CardTitle className="text-2xl font-semibold text-blue-700">Supplier Login</CardTitle>
          <CardDescription>Access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">Login</Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/supplier/signup" className="underline text-blue-600 hover:text-blue-700">
              Sign up as Supplier
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
