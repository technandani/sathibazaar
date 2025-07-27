import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Gift, History, PlusCircle, MinusCircle } from "lucide-react"
import VendorLayout from "@/components/vendor-layout"

const transactions = [
  { id: 1, type: "Credit", description: "Group Order #123 Savings", amount: "+₹250", date: "2024-07-25" },
  { id: 2, type: "Debit", description: "Raw Material Purchase #456", amount: "-₹1500", date: "2024-07-24" },
  { id: 3, type: "Credit", description: "Referral Bonus", amount: "+₹100", date: "2024-07-23" },
  { id: 4, type: "Credit", description: "Pickup Lead Bonus #789", amount: "+₹50", date: "2024-07-22" },
  { id: 5, type: "Debit", description: "Raw Material Purchase #101", amount: "-₹800", date: "2024-07-21" },
]

const rewards = [
  {
    id: 1,
    name: "Refer a Friend",
    bonus: "₹100",
    status: "Active",
    description: "Get ₹100 for every friend who joins and places their first order.",
  },
  {
    id: 2,
    name: "Pickup Lead",
    bonus: "₹50",
    status: "Active",
    description: "Earn ₹50 for leading a successful group order pickup.",
  },
  {
    id: 3,
    name: "Loyalty Bonus",
    bonus: "₹200",
    status: "Claimed",
    description: "Claimed for completing 10 group orders.",
  },
]

export default function VendorWalletPage() {
  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your UPI wallet balance and earned rewards.</p>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UPI Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹1,250.00</div>
            <p className="text-xs opacity-90 mt-1">Available for your next order</p>
            <div className="flex space-x-2 mt-4">
              <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Money
              </Button>
              <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                <MinusCircle className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Earned Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Earned Rewards
            </CardTitle>
            <CardDescription>Bonuses and incentives you've earned.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{reward.name}</h3>
                    <Badge variant={reward.status === "Active" ? "default" : "outline"}>{reward.status}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-2">{reward.bonus}</p>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                  {reward.status === "Active" && (
                    <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                      Learn More
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Transaction History
            </CardTitle>
            <CardDescription>All your wallet transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge variant={transaction.type === "Credit" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell
                        className={
                          transaction.type === "Credit" ? "text-green-600 font-medium" : "text-red-600 font-medium"
                        }
                      >
                        {transaction.amount}
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  )
}
