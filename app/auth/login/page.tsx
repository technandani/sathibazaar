"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"vendor" | "supplier" | "admin">("vendor");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LoginPage: handleLogin called with", { email, password, role: activeTab });
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}!`,
      });
      router.push(`/${activeTab}/dashboard`);
    } catch (error) {
      console.error("LoginPage: Login error:", error);
      toast({
        title: "Login Failed",
        description: (error as Error).message || "Invalid credentials. Please try again.",
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
          <CardTitle className="text-2xl font-semibold text-blue-700">Login</CardTitle>
          <CardDescription>Access your dashboard by selecting your role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "vendor" | "supplier" | "admin")} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-blue-100">
              <TabsTrigger value="vendor" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Vendor
              </TabsTrigger>
              <TabsTrigger value="supplier" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Supplier
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Admin
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <form onSubmit={handleLogin} className="space-y-4">
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline text-blue-600 hover:text-blue-700">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-blue-300 focus:border-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  disabled={isLoading}
                  onClick={() => console.log("LoginPage: Login button clicked")}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href={`/${activeTab}/signup`} className="underline text-blue-600 hover:text-blue-700">
              Sign up as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Link>
          </div>
          {activeTab === "admin" && (
            <div className="mt-2 text-center text-xs text-gray-500">
              Admin Credentials: admin@example.com / admin@123
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}