"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Users,
  TrendingDown,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Zap,
  Award,
  Target,
  Truck,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const stats = [
  { label: "Active Vendors", value: "2,500+", icon: Users },
  { label: "Suppliers", value: "150+", icon: Truck },
  { label: "Orders Completed", value: "10,000+", icon: CheckCircle },
  { label: "Money Saved", value: "₹50L+", icon: DollarSign },
]

const features = [
  {
    icon: Users,
    title: "Group Buying Power",
    description: "Join forces with nearby vendors to unlock bulk pricing and maximize your savings.",
    color: "bg-blue-500",
  },
  {
    icon: TrendingDown,
    title: "Dynamic Pricing",
    description: "Watch prices drop in real-time as more vendors join your group order.",
    color: "bg-green-500",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe and secure payment processing with multiple payment options.",
    color: "bg-purple-500",
  },
  {
    icon: Clock,
    title: "Quick Delivery",
    description: "Fast and reliable delivery from trusted local suppliers in your area.",
    color: "bg-orange-500",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Get real-time updates on order status, price changes, and delivery schedules.",
    color: "bg-yellow-500",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "All suppliers are verified and rated by the vendor community.",
    color: "bg-red-500",
  },
]

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Street Food Vendor",
    location: "Delhi",
    image: "R",
    rating: 5,
    text: "SathiBazaar helped me save 30% on my monthly raw material costs. The group ordering system is brilliant! I can now focus more on my business instead of worrying about ingredient costs.",
    savings: "₹8,000/month",
  },
  {
    name: "Priya Sharma",
    role: "Chaat Vendor",
    location: "Mumbai",
    image: "P",
    rating: 5,
    text: "The quality of ingredients is excellent and the delivery is always on time. My customers have noticed the difference in taste since I started using SathiBazaar.",
    savings: "₹5,500/month",
  },
  {
    name: "Suresh Vegetables",
    role: "Wholesale Supplier",
    location: "Bangalore",
    image: "S",
    rating: 5,
    text: "As a supplier, I love the bulk orders. It's easier to manage inventory and vendors get better prices too. Win-win for everyone!",
    savings: "40% more orders",
  },
]

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                SathiBazaar
              </h1>
              <p className="text-xs text-gray-500">Smart Group Buying</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link href="auth/login">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                 Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Text and Buttons */}
          <div className="text-left space-y-6 px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Group Orders,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Bigger Savings
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              Team up with local vendors and suppliers to bulk order raw materials and secure unbeatable discounts.
              <span className="font-semibold text-blue-600"> Start today with SathiBazaar!</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/vendor/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Join as Vendor
                </Button>
              </Link>
              <Link href="/supplier/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold bg-white/90 backdrop-blur-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Join as Supplier
                </Button>
              </Link>
            </div>

            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 group flex items-center text-base md:text-lg"
            >
              <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center mr-3 group-hover:bg-blue-50 group-hover:shadow-xl transition-all duration-300">
                <Play className="h-5 w-5 text-blue-600 ml-1 group-hover:scale-110 transition-transform" />
              </div>
              Watch how it works (2 min)
            </Button>
          </div>

          {/* Right: Image */}
          <div className="relative hidden md:block">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/hero-img.png"
                alt="Street food vendors collaborating"
                fill
                className="object-contain"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 group-hover:shadow-lg transition-all duration-300">
                <stat.icon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">Simple Process</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">How SathiBazaar Works</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and start saving on your raw material costs immediately
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:scale-105">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <div className="w-8 h-1 bg-green-500 mx-auto mb-4"></div>
                <h4 className="text-2xl font-bold mb-4">1. Join Group Orders</h4>
                <p className="text-gray-600 leading-relaxed">
                  Find nearby vendors ordering the same raw materials and join their group to unlock bulk pricing.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:scale-105">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingDown className="h-10 w-10 text-white" />
                </div>
                <div className="w-8 h-1 bg-blue-500 mx-auto mb-4"></div>
                <h4 className="text-2xl font-bold mb-4">2. Get Bulk Discounts</h4>
                <p className="text-gray-600 leading-relaxed">
                  Watch prices drop automatically as more vendors join your group order. More vendors = better prices!
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:scale-105">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <div className="w-8 h-1 bg-purple-500 mx-auto mb-4"></div>
                <h4 className="text-2xl font-bold mb-4">3. Pickup Your Order</h4>
                <p className="text-gray-600 leading-relaxed">
                  Collect your discounted raw materials from the designated pickup point at your convenient time.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Process Flow */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold mb-4">Ready to start saving?</h4>
                <p className="text-gray-600 mb-6">Join thousands of vendors already saving money</p>
                <Link href="/vendor/dashboard">
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg">
                    Get Started Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="text-6xl">🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">Why Choose Us</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to save money and grow your street food business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:scale-105"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200">Success Stories</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from vendors and suppliers who are saving money with SathiBazaar
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">{testimonials[currentTestimonial].image}</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{testimonials[currentTestimonial].name}</p>
                      <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                      <p className="text-sm text-gray-500">{testimonials[currentTestimonial].location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                      Saved {testimonials[currentTestimonial].savings}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? "bg-green-600 w-8" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
        <div className="container mx-auto text-center text-white">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h3>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of vendors who are already saving money and growing their businesses with SathiBazaar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vendor/dashboard">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Users className="h-5 w-5 mr-2" />
                Start Saving Today
              </Button>
            </Link>
            <Link href="/supplier/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent backdrop-blur-sm hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Truck className="h-5 w-5 mr-2" />
                Become a Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    SathiBazaar
                  </span>
                  <p className="text-xs text-gray-400">Smart Group Buying</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting street food vendors for better bulk purchasing power and helping businesses grow together.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">For Vendors</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/vendor/signup" className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/vendor/dashboard" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/vendor/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/vendor/success-stories" className="hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-green-400" /> +91 98765 43210
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-green-400" /> support@sathibazaar.com
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-green-400" /> Delhi, India
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SathiBazaar. All rights reserved. Made with ❤️ for street food vendors.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}