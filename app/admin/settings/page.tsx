"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Globe, Users, Plug } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [platformName, setPlatformName] = useState("SathiBazaar")
  const [contactEmail, setContactEmail] = useState("support@sathibazaar.com")
  const [contactPhone, setContactPhone] = useState("+91 98765 43210")
  const [address, setAddress] = useState("123 Main Street, Delhi, India")
  const [enableRegistrations, setEnableRegistrations] = useState(true)
  const [enableSupplierApplications, setEnableSupplierApplications] = useState(true)

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ platformName, contactEmail, contactPhone, address })
    toast({
      title: "Settings Saved!",
      description: "General platform settings have been updated.",
    })
  }

  const handleSaveUserManagementSettings = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ enableRegistrations, enableSupplierApplications })
    toast({
      title: "Settings Saved!",
      description: "User management settings have been updated.",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Platform Settings</h1>
          <p className="text-gray-600">Configure various aspects of the SathiBazaar platform.</p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
            <CardDescription>Basic information and contact details for the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
              </div>
              <Button type="submit" className="bg-gray-700 hover:bg-gray-800">
                Save General Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* User Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Management
            </CardTitle>
            <CardDescription>Control user registration and supplier application processes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveUserManagementSettings} className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-registrations" className="flex flex-col space-y-1">
                  <span>Enable New Vendor Registrations</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Allow new street food vendors to sign up for the platform.
                  </span>
                </Label>
                <Switch
                  id="enable-registrations"
                  checked={enableRegistrations}
                  onCheckedChange={setEnableRegistrations}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-supplier-applications" className="flex flex-col space-y-1">
                  <span>Enable New Supplier Applications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Allow new suppliers to apply to join the platform.
                  </span>
                </Label>
                <Switch
                  id="enable-supplier-applications"
                  checked={enableSupplierApplications}
                  onCheckedChange={setEnableSupplierApplications}
                />
              </div>
              <Button type="submit" className="bg-gray-700 hover:bg-gray-800">
                Save User Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* API Keys & Integrations (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plug className="h-5 w-5 mr-2" />
              API Keys & Integrations
            </CardTitle>
            <CardDescription>Manage API keys and third-party service integrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-gateway-api">Payment Gateway API Key</Label>
              <Input id="payment-gateway-api" type="password" placeholder="********************" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-api">SMS Gateway API Key</Label>
              <Input id="sms-api" type="password" placeholder="********************" />
            </div>
            <Button variant="outline">Generate New Key</Button>
            <Button variant="outline" className="ml-2 bg-transparent">
              Save Integration Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
