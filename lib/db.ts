// This file simulates a database using in-memory arrays.
// In a real Next.js application, you would connect to MongoDB here using Mongoose.

type UserRole = "Vendor" | "Supplier" | "Admin"
type UserStatus = "Active" | "Inactive" | "Suspended"
type VerificationStatus = "Verified" | "Unverified"

export interface User {
  id: string
  name: string
  email: string
  password?: string // Only for registration/login, not stored in client-side data
  role: UserRole
  status: UserStatus
  verification: VerificationStatus
  lastLogin: string
  otp?: string // Temporary for OTP verification
  otpExpires?: number // Timestamp for OTP expiry
}

export interface Product {
  id: string
  name: string
  unitPrice: number
  unit: string
  availability: "In Stock" | "Out of Stock" | "Limited"
  locationServed: string
  image: string
  supplierId: string // Link to supplier
  supplierName: string // Denormalized for easier display
}

export interface Order {
  id: string
  item: string
  quantity: string
  totalAmount: string
  vendor: string
  supplier: string
  status: "Completed" | "Pending" | "In Progress" | "Pending Pickup" | "Cancelled"
  date: string
  vendorId: string
  supplierId: string
}

export interface Complaint {
  id: string
  user: string
  userType: string
  issue: string
  status: "Open" | "In Progress" | "Resolved"
  priority: "High" | "Medium" | "Low"
  date: string
  resolutionNotes?: string
  userId: string
}

// In-memory "database"
export const users: User[] = [
  {
    id: "USR-001",
    name: "Rajesh Kumar",
    email: "rajesh.k@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "Vendor",
    status: "Active",
    verification: "Verified",
    lastLogin: "2024-07-28",
  },
  {
    id: "USR-002",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    password: "password123",
    role: "Supplier",
    status: "Active",
    verification: "Verified",
    lastLogin: "2024-07-27",
  },
  {
    id: "USR-003",
    name: "Amit Singh",
    email: "amit.s@example.com",
    password: "password123",
    role: "Vendor",
    status: "Inactive",
    verification: "Unverified",
    lastLogin: "2024-07-20",
  },
  {
    id: "USR-004",
    name: "Kiran Devi",
    email: "kiran.d@example.com",
    password: "password123",
    role: "Supplier",
    status: "Suspended",
    verification: "Verified",
    lastLogin: "2024-07-15",
  },
  {
    id: "USR-005",
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin@123", // Hardcoded admin credentials
    role: "Admin",
    status: "Active",
    verification: "Verified",
    lastLogin: "2024-07-29",
  },
]

export const products: Product[] = [
  {
    id: "P-001",
    name: "Onions",
    unitPrice: 28,
    unit: "kg",
    availability: "In Stock",
    locationServed: "Delhi NCR",
    image: "/placeholder.svg?height=50&width=50",
    supplierId: "USR-002",
    supplierName: "Priya Sharma",
  },
  {
    id: "P-002",
    name: "Tomatoes",
    unitPrice: 42,
    unit: "kg",
    availability: "Limited",
    locationServed: "Delhi NCR",
    image: "/placeholder.svg?height=50&width=50",
    supplierId: "USR-002",
    supplierName: "Priya Sharma",
  },
  {
    id: "P-003",
    name: "Potatoes",
    unitPrice: 20,
    unit: "kg",
    availability: "In Stock",
    locationServed: "Delhi NCR",
    image: "/placeholder.svg?height=50&width=50",
    supplierId: "USR-004",
    supplierName: "Kiran Devi",
  },
]

export const orders: Order[] = [
  {
    id: "GO-001",
    item: "Onions",
    quantity: "150 kg",
    totalAmount: "₹3750",
    vendor: "Rajesh Kumar",
    supplier: "Suresh Vegetables",
    status: "Completed",
    date: "2024-07-20",
    vendorId: "USR-001",
    supplierId: "USR-002",
  },
  {
    id: "GO-002",
    item: "Tomatoes",
    quantity: "200 kg",
    totalAmount: "₹7000",
    vendor: "Priya Sharma",
    supplier: "Fresh Mart",
    status: "Pending",
    date: "2024-07-26",
    vendorId: "USR-003",
    supplierId: "USR-002",
  },
]

export const complaints: Complaint[] = [
  {
    id: "CMP-001",
    user: "Rajesh Kumar",
    userType: "Vendor",
    issue: "Late delivery of onions (Order GO-001)",
    status: "Open",
    priority: "High",
    date: "2024-07-21",
    userId: "USR-001",
  },
  {
    id: "CMP-002",
    user: "Suresh Vegetables",
    userType: "Supplier",
    issue: "Payment delay for Order GO-001",
    status: "Resolved",
    priority: "Medium",
    date: "2024-07-22",
    resolutionNotes: "Payment processed on 2024-07-22. User notified.",
    userId: "USR-002",
  },
]

// Temporary storage for OTPs (in a real app, this would be in a database with expiry)
export const otpStore = new Map<string, { otp: string; expires: number }>()

// Helper to generate unique IDs
export const generateId = (prefix: string, currentLength: number) => {
  return `${prefix}-${(currentLength + 1).toString().padStart(3, "0")}`
}
