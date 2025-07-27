"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageSquare, Mail, Phone } from "lucide-react"
import VendorLayout from "@/components/vendor-layout"
import { useToast } from "@/components/ui/use-toast"

const faqItems = [
  {
    question: "How do group orders work?",
    answer:
      "Group orders allow multiple vendors to combine their raw material needs to achieve bulk discounts. As more vendors join an order, the price per unit decreases. Once the minimum quantity is met, the order is placed with a supplier.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We primarily support UPI payments for quick and secure transactions. Other options like net banking and debit/credit cards may be available soon.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You can track your order status in the 'Order History' section of your Vendor Panel. You'll also receive real-time notifications on price changes and delivery updates.",
  },
  {
    question: "What if I receive a damaged or incorrect order?",
    answer:
      "Please contact our support team immediately through the chat or contact form. Provide your order ID and details of the issue, and we will assist you in resolving it.",
  },
  {
    question: "Can I cancel a group order?",
    answer:
      "Cancellation policies vary depending on the order status. Please refer to our terms and conditions or contact support for specific order cancellations.",
  },
]

export default function VendorHelpPage() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log({ name, email, subject, message })
    toast({
      title: "Support Request Sent!",
      description: "We have received your message and will get back to you shortly.",
    })
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
          <p className="text-gray-600">Find answers to common questions or contact our support team.</p>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Find quick answers to common queries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-700">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Support
            </CardTitle>
            <CardDescription>Can't find what you're looking for? Reach out to us.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Send Message
              </Button>
            </form>

            <div className="border-t pt-6 mt-6 space-y-4">
              <h3 className="font-semibold text-lg">Other Ways to Contact Us:</h3>
              <div className="flex items-center space-x-3 text-gray-700">
                <Phone className="h-5 w-5 text-green-600" />
                <span>Phone: +91 98765 43210 (Mon-Fri, 9 AM - 6 PM)</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="h-5 w-5 text-green-600" />
                <span>Email: support@sathibazaar.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  )
}
