"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Image src="/placeholder-logo.png" alt="SathiBazaar Logo" width={32} height={32} />
          <span className="sr-only">SathiBazaar</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/vendor/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Vendor Login
          </Link>
          <Link
            href="/supplier/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Supplier Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-b">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:grid-cols-2 md:gap-8">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    SathiBazaar: Empowering Street Food Vendors
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Join forces with other vendors to unlock bulk discounts and streamline your procurement.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/vendor/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700 disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Start as Vendor
                  </Link>
                  <Link
                    href="/supplier/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    prefetch={false}
                  >
                    Join as Supplier
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
                <Image
                  src="/hero-group-buying.png"
                  alt="Group buying for street food vendors"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  SathiBazaar simplifies bulk procurement for street food vendors and connects them with reliable
                  suppliers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Create/Join Group Order</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Vendors can initiate new orders or join existing ones to pool demand.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Unlock Discounts</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    As more vendors join, the collective buying power increases, leading to better prices.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Efficient Delivery</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Suppliers fulfill bulk orders, ensuring timely and cost-effective delivery to pickup points.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" className="bg-transparent">
                Watch how it works
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Beyond Savings</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  SathiBazaar offers more than just discounts.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="flex flex-col items-center p-6 text-center">
                <CardHeader>
                  <CardTitle>Community Driven</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Connect with other vendors, share insights, and grow your business together.
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center">
                <CardHeader>
                  <CardTitle>Smart Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Access data and analytics to make informed purchasing decisions.
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col items-center p-6 text-center">
                <CardHeader>
                  <CardTitle>Optimized Logistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Streamlined delivery processes mean less hassle and more time for your business.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Users Say</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Hear from vendors and suppliers who have transformed their businesses with SathiBazaar.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarImage src="/testimonial-rajesh.png" alt="Rajesh Kumar" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-semibold">Rajesh Kumar</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Street Food Vendor</p>
                  <div className="flex items-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "SathiBazaar has revolutionized how I source my ingredients. The group discounts are incredible, and
                    the process is so smooth!"
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarImage src="/testimonial-priya.png" alt="Priya Sharma" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-semibold">Priya Sharma</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Street Food Vendor</p>
                  <div className="flex items-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "Joining group orders has saved me so much money and time. It's a game-changer for small businesses
                    like mine."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarImage src="/testimonial-suresh.png" alt="Suresh Vegetables" />
                    <AvatarFallback>SV</AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-semibold">Suresh Vegetables</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Supplier</p>
                  <div className="flex items-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    "SathiBazaar has opened up a new market for my produce. The bulk orders make logistics much more
                    efficient."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 SathiBazaar. All rights reserved.</p>
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
