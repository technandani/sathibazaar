"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { CircleDollarSign, Users, Truck, BarChart, ShoppingCart, Menu, ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast({
        title: "Signed Up!",
        description: "You've successfully subscribed to our newsletter.",
      })
      setEmail("")
    } else {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-sm">
        <Link href="#" className="flex items-center justify-center gap-2 font-bold text-lg" prefetch={false}>
          <ShoppingCart className="h-6 w-6 text-green-600" />
          SathiBazaar
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            How it Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Testimonials
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="md:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="#features" className="w-full" prefetch={false}>
                  Features
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#how-it-works" className="w-full" prefetch={false}>
                  How it Works
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#testimonials" className="w-full" prefetch={false}>
                  Testimonials
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#contact" className="w-full" prefetch={false}>
                  Contact
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/vendor/login" className="w-full" prefetch={false}>
                  Vendor Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/supplier/login" className="w-full" prefetch={false}>
                  Supplier Login
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/vendor/login" prefetch={false}>
                Vendor Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/supplier/login" prefetch={false}>
                Supplier Login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-50 to-green-100">
          <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl leading-tight">
                Empower Your Business with Group Buying
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl mx-auto lg:mx-0">
                SathiBazaar connects street food vendors for bulk purchases, ensuring better prices and fresh produce.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/vendor/signup" prefetch={false}>
                    Start as Vendor
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  <Link href="/supplier/signup" prefetch={false}>
                    Join as Supplier
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/hero-group-buying.png" // Attractive image related to group buying
                width={600}
                height={400}
                alt="Group buying for street food vendors"
                className="rounded-xl shadow-lg object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose SathiBazaar?</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Unlock a world of benefits designed specifically for street food vendors and suppliers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-10 py-12">
              <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <CircleDollarSign className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Cost Savings</CardTitle>
                <CardDescription>
                  Access bulk pricing by pooling orders with other vendors, significantly reducing your procurement
                  costs.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Community Driven</CardTitle>
                <CardDescription>Join a network of local vendors, share insights, and grow together.</CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <Truck className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Optimized Logistics</CardTitle>
                <CardDescription>
                  Streamlined delivery processes ensure fresh produce reaches you efficiently and on time.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <BarChart className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Smart Insights</CardTitle>
                <CardDescription>
                  Gain valuable data on popular products and purchasing trends to make informed decisions.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Quality Assurance</CardTitle>
                <CardDescription>
                  We partner with trusted suppliers to ensure you receive only the freshest and highest quality
                  ingredients.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <ShoppingCart className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle className="text-xl font-bold mb-2">Easy Ordering</CardTitle>
                <CardDescription>
                  Our intuitive platform makes placing and managing group orders simple and hassle-free.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How SathiBazaar Works</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple, step-by-step guide to getting the most out of our platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-12">
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-xl font-bold mb-2">Create or Join a Group Order</CardTitle>
                <CardDescription>
                  Vendors can initiate new group orders for specific produce or join existing ones to meet minimum
                  quantities.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-xl font-bold mb-2">Suppliers Fulfill Orders</CardTitle>
                <CardDescription>
                  Verified suppliers receive consolidated orders and prepare for efficient bulk delivery.
                </CardDescription>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center shadow-md">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-xl font-bold mb-2">Receive & Review</CardTitle>
                <CardDescription>
                  Vendors receive their fresh produce and can provide feedback on supplier performance.
                </CardDescription>
              </Card>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-100 bg-transparent"
              >
                Watch how it works <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from vendors and suppliers who have transformed their businesses with SathiBazaar.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-12">
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-0">
                  <Image
                    src="/testimonial-rajesh.png" // User image
                    width={80}
                    height={80}
                    alt="Rajesh Kumar"
                    className="rounded-full mb-4 object-cover"
                  />
                  <p className="text-lg font-semibold mb-2">"SathiBazaar has revolutionized my procurement!"</p>
                  <p className="text-gray-700 mb-4">
                    "I used to spend hours sourcing produce, but now with group orders, I save so much time and money.
                    The quality is consistently excellent."
                  </p>
                  <p className="text-sm font-medium text-gray-500">- Rajesh Kumar, Street Food Vendor</p>
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-0">
                  <Image
                    src="/testimonial-priya.png" // User image
                    width={80}
                    height={80}
                    alt="Priya Sharma"
                    className="rounded-full mb-4 object-cover"
                  />
                  <p className="text-lg font-semibold mb-2">"Efficient and reliable platform for suppliers."</p>
                  <p className="text-gray-700 mb-4">
                    "Managing bulk orders through SathiBazaar is seamless. It helps me reach more vendors and optimize
                    my delivery routes. Highly recommended!"
                  </p>
                  <p className="text-sm font-medium text-gray-500">- Priya Sharma, Vegetable Supplier</p>
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-0">
                  <Image
                    src="/testimonial-suresh.png" // User image
                    width={80}
                    height={80}
                    alt="Suresh Singh"
                    className="rounded-full mb-4 object-cover"
                  />
                  <p className="text-lg font-semibold mb-2">"Better prices, better quality, happier customers."</p>
                  <p className="text-gray-700 mb-4">
                    "The savings I get from SathiBazaar allow me to invest more in my food quality. My customers notice
                    the difference, and my business is thriving."
                  </p>
                  <p className="text-sm font-medium text-gray-500">- Suresh Singh, Chaat Stall Owner</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action / Newsletter Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-green-100">
          <div className="container px-4 md:px-6 text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Grow Your Business?</h2>
            <p className="max-w-[700px] text-gray-600 md:text-xl mx-auto">
              Join SathiBazaar today and experience the power of collective buying and selling. Subscribe to our
              newsletter for updates!
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-gray-500">&copy; 2024 SathiBazaar. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
