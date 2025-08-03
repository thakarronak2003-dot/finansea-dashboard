import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const securities = [
  { symbol: "AAPL", name: "Apple Inc.", price: 185.42 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 238.15 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.87 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 155.73 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 721.33 },
];

// Mock function to generate price forecast data
const generateForecast = (symbol: string, orderType: string) => {
  const security = securities.find(s => s.symbol === symbol);
  if (!security) return null;

  const basePrice = security.price;
  const isPositive = Math.random() > 0.4; // 60% chance of positive forecast
  const changePercent = (Math.random() * 8 + 2) * (isPositive ? 1 : -1); // 2-10% change
  const predictedPrice = basePrice * (1 + changePercent / 100);
  
  // Generate mock chart data
  const chartData = [];
  for (let i = 0; i <= 7; i++) {
    const progress = i / 7;
    const price = basePrice + (predictedPrice - basePrice) * progress + (Math.random() - 0.5) * 5;
    chartData.push({
      day: `Day ${i + 1}`,
      price: Math.round(price * 100) / 100
    });
  }

  const reasons = [
    "strong quarterly earnings and market momentum",
    "recent strategic partnerships and product launches", 
    "favorable market conditions and sector growth",
    "technical indicators showing bullish patterns",
    "increased institutional investor confidence",
    "market volatility and economic uncertainty",
    "sector-wide concerns affecting performance",
    "recent regulatory challenges impacting outlook"
  ];

  return {
    isPositive,
    changePercent: Math.abs(changePercent),
    predictedPrice,
    currentPrice: basePrice,
    explanation: `Based on ${reasons[Math.floor(Math.random() * reasons.length)]}, our AI model predicts ${isPositive ? 'upward' : 'downward'} movement in the coming week.`,
    chartData,
    confidence: Math.floor(Math.random() * 20 + 70) // 70-90% confidence
  };
};

export default function SimulatedTrading() {
  const [selectedSecurity, setSelectedSecurity] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("buy");
  const [forecast, setForecast] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateTrade = async () => {
    if (!selectedSecurity || !quantity) return;

    setIsSimulating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = generateForecast(selectedSecurity, orderType);
    setForecast(result);
    setIsSimulating(false);
  };

  const selectedSecurityData = securities.find(s => s.symbol === selectedSecurity);
  const estimatedTotal = selectedSecurityData && quantity 
    ? (selectedSecurityData.price * parseFloat(quantity || "0")).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Simulated Trading</h1>
          <p className="text-muted-foreground">
            Test your trading strategies with AI-powered market predictions
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trading Form */}
        <Card>
          <CardHeader>
            <CardTitle>Simulate Trade</CardTitle>
            <CardDescription>
              Enter your trade details to get AI-powered market predictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                        <span className="font-medium">{security.symbol}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ${security.price}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-3">
              <Label>Order Type</Label>
              <RadioGroup
                value={orderType}
                onValueChange={setOrderType}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="text-green-600 font-medium">
                    Buy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="text-red-600 font-medium">
                    Sell
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {selectedSecurityData && quantity && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Estimated Total:</span>
                  <span className="text-lg font-bold">${estimatedTotal}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleSimulateTrade}
              disabled={!selectedSecurity || !quantity || isSimulating}
              className="w-full"
              size="lg"
            >
              {isSimulating ? "Analyzing Market..." : "Simulate Trade"}
            </Button>
          </CardContent>
        </Card>

        {/* Forecast Results */}
        <div className="space-y-6">
          {forecast ? (
            <>
              {/* Forecast Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {forecast.isPositive ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <span>Market Forecast</span>
                    <Badge variant="secondary">{forecast.confidence}% Confidence</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-bold">${forecast.currentPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Predicted Price</p>
                        <p className={`text-2xl font-bold ${forecast.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          ${forecast.predictedPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 text-sm ${forecast.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {forecast.isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {forecast.isPositive ? '+' : '-'}{forecast.changePercent.toFixed(2)}% expected movement
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{forecast.explanation}</p>
                </CardContent>
              </Card>

              {/* Price Movement Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Predicted Price Movement</CardTitle>
                  <CardDescription>7-day forecast simulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecast.chartData}>
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          domain={['dataMin - 5', 'dataMax + 5']}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Price']}
                          labelStyle={{ color: 'var(--foreground)' }}
                          contentStyle={{ 
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={forecast.isPositive ? "#22c55e" : "#ef4444"}
                          strokeWidth={2}
                          dot={{ fill: forecast.isPositive ? "#22c55e" : "#ef4444", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
                  <p>Run a simulation to see AI-powered market predictions</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}