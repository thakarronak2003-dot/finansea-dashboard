import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, History, Plus, Wallet as WalletIcon } from "lucide-react";

const mockTransactions = [
  { id: 1, type: "deposit", amount: 1000, method: "Bank Transfer", date: "2024-01-15", status: "completed" },
  { id: 2, type: "deposit", amount: 500, method: "Credit Card", date: "2024-01-10", status: "completed" },
  { id: 3, type: "withdrawal", amount: 200, method: "Bank Transfer", date: "2024-01-08", status: "pending" },
];

export default function Wallet() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [walletBalance] = useState(2850.00);

  const handleAddMoney = () => {
    if (!amount || !paymentMethod) return;
    // This will be connected to backend later
    console.log("Adding money:", { amount, paymentMethod });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <WalletIcon className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Wallet</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Balance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                ${walletBalance.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Available for Trading */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available for Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                ${(walletBalance * 0.9).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <History className="h-4 w-4 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">
                $200.00
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Money Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Money</span>
            </CardTitle>
            <CardDescription>
              Add funds to your trading wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">
                    <div className="flex items-center space-x-2">
                      <span>🏦</span>
                      <span>Bank Transfer (3-5 days)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="debit-card">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Debit Card (Instant)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="wire-transfer">
                    <div className="flex items-center space-x-2">
                      <span>🔄</span>
                      <span>Wire Transfer (1-2 days)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Amount to add:</span>
                <span>${amount || "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing fee:</span>
                <span>$0.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${amount || "0.00"}</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleAddMoney}
              disabled={!amount || !paymentMethod}
            >
              Add Money to Wallet
            </Button>

            <p className="text-xs text-muted-foreground">
              Your funds will be available for trading once the deposit is confirmed.
            </p>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Recent Transactions</span>
            </CardTitle>
            <CardDescription>
              Your recent wallet activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.method}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {transaction.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}