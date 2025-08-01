import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const securities = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.32, change: -1.8 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.67, change: 3.2 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 412.89, change: 0.7 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2758.42, change: -0.9 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.92, change: 2.1 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.42, change: 4.8 },
];

export default function OrderExecution() {
  const [selectedSecurity, setSelectedSecurity] = useState("");
  const [orderType, setOrderType] = useState("BUY");
  const [quantity, setQuantity] = useState("");
  
  const selectedStock = securities.find(s => s.symbol === selectedSecurity);
  const estimatedTotal = selectedStock && quantity ? (selectedStock.price * parseInt(quantity || "0")).toFixed(2) : "0.00";

  const handleExecuteTrade = () => {
    if (!selectedSecurity || !quantity) {
      toast({
        title: "Incomplete Order",
        description: "Please select a security and enter quantity",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Trade Executed Successfully",
      description: `${orderType} ${quantity} shares of ${selectedSecurity} at $${selectedStock?.price}`,
    });

    // Reset form
    setSelectedSecurity("");
    setQuantity("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Execution</h1>
        <p className="text-muted-foreground">Execute buy and sell orders with real-time pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Selection */}
              <div className="space-y-2">
                <Label htmlFor="security">Select Security</Label>
                <Select value={selectedSecurity} onValueChange={setSelectedSecurity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a security" />
                  </SelectTrigger>
                  <SelectContent>
                    {securities.map((security) => (
                      <SelectItem key={security.symbol} value={security.symbol}>
                        <div className="flex items-center justify-between w-full">
                          <span>{security.symbol} - {security.name}</span>
                          <span className="ml-2 font-medium">${security.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Order Type */}
              <div className="space-y-3">
                <Label>Order Type</Label>
                <RadioGroup value={orderType} onValueChange={setOrderType} className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BUY" id="buy" />
                    <Label htmlFor="buy" className="text-buy font-semibold">BUY</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SELL" id="sell" />
                    <Label htmlFor="sell" className="text-sell font-semibold">SELL</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter number of shares"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>

              <Separator />

              {/* Order Summary */}
              {selectedStock && (
                <div className="space-y-3 p-4 rounded-lg bg-accent/30">
                  <h3 className="font-semibold">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Security:</span>
                      <span className="font-medium">{selectedStock.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per share:</span>
                      <span className="font-medium">${selectedStock.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-medium">{quantity || "0"} shares</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base">
                      <span>Estimated Total:</span>
                      <span>${estimatedTotal}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleExecuteTrade}
                className={`w-full font-semibold ${
                  orderType === "BUY" 
                    ? "bg-buy hover:bg-buy/90" 
                    : "bg-sell hover:bg-sell/90"
                }`}
                disabled={!selectedSecurity || !quantity}
              >
                Execute {orderType} Order
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Price Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securities.map((security) => (
                  <div 
                    key={security.symbol} 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSecurity === security.symbol 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedSecurity(security.symbol)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{security.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {security.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${security.price}</div>
                        <div className={`text-xs flex items-center ${
                          security.change >= 0 ? "text-profit" : "text-loss"
                        }`}>
                          {security.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {security.change >= 0 ? "+" : ""}{security.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}