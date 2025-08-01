import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const securities = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
];

// Synthetic historical data (July-Aug 2025)
const generateHistoricalData = (symbol: string) => {
  const basePrice = {
    AAPL: 170,
    TSLA: 240,
    MSFT: 410,
    GOOGL: 2750,
    AMZN: 175,
    NVDA: 850,
  }[symbol] || 100;

  const data = [];
  const dates = [];
  let currentDate = new Date("2025-07-01");
  
  while (currentDate <= new Date("2025-08-31")) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  let price = basePrice;
  let sma20 = basePrice;
  let ema12 = basePrice;
  
  dates.forEach((date, index) => {
    const volatility = 0.02;
    const trend = symbol === "NVDA" ? 0.001 : symbol === "TSLA" ? 0.0005 : 0.0002;
    const change = (Math.random() - 0.5) * volatility + trend;
    
    price = price * (1 + change);
    
    // Simple Moving Average (20 days)
    if (index >= 19) {
      const last20 = data.slice(-19).concat([{ price }]);
      sma20 = last20.reduce((sum, item) => sum + item.price, 0) / 20;
    }
    
    // Exponential Moving Average (12 days)
    const multiplier = 2 / (12 + 1);
    ema12 = (price * multiplier) + (ema12 * (1 - multiplier));
    
    // RSI (simplified)
    let rsi = 50;
    if (index > 14) {
      const gains = [];
      const losses = [];
      for (let i = Math.max(0, index - 14); i < index; i++) {
        const change = data[i] ? (price - data[i].price) / data[i].price : 0;
        if (change > 0) gains.push(change);
        else losses.push(Math.abs(change));
      }
      const avgGain = gains.length ? gains.reduce((a, b) => a + b, 0) / gains.length : 0;
      const avgLoss = losses.length ? losses.reduce((a, b) => a + b, 0) / losses.length : 0;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      sma20: Math.round(sma20 * 100) / 100,
      ema12: Math.round(ema12 * 100) / 100,
      rsi: Math.round(rsi * 100) / 100,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  });

  return data;
};

export default function Charts() {
  const [selectedSecurity, setSelectedSecurity] = useState("AAPL");
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showRSI, setShowRSI] = useState(false);

  const chartData = generateHistoricalData(selectedSecurity);
  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const priceChange = chartData.length > 1 
    ? currentPrice - chartData[chartData.length - 2].price 
    : 0;
  const priceChangePercent = chartData.length > 1 
    ? (priceChange / chartData[chartData.length - 2].price) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Charts & Analysis</h1>
        <p className="text-muted-foreground">Technical analysis and price charts</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="space-y-2">
            <Label>Select Security</Label>
            <Select value={selectedSecurity} onValueChange={setSelectedSecurity}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {securities.map((security) => (
                  <SelectItem key={security.symbol} value={security.symbol}>
                    {security.symbol} - {security.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="sma"
              checked={showSMA}
              onCheckedChange={setShowSMA}
            />
            <Label htmlFor="sma" className="text-sm">SMA (20)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="ema"
              checked={showEMA}
              onCheckedChange={setShowEMA}
            />
            <Label htmlFor="ema" className="text-sm">EMA (12)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="rsi"
              checked={showRSI}
              onCheckedChange={setShowRSI}
            />
            <Label htmlFor="rsi" className="text-sm">RSI</Label>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedSecurity}</h2>
              <p className="text-muted-foreground">
                {securities.find(s => s.symbol === selectedSecurity)?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${currentPrice.toFixed(2)}</div>
              <div className={`text-lg flex items-center justify-end ${
                priceChange >= 0 ? "text-profit" : "text-loss"
              }`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)} ({priceChange >= 0 ? "+" : ""}{priceChangePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price Chart (July - August 2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => [
                    `$${parseFloat(value as string).toFixed(2)}`,
                    name === "price" ? "Price" : 
                    name === "sma20" ? "SMA (20)" : 
                    name === "ema12" ? "EMA (12)" : name
                  ]}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                />
                
                {showSMA && (
                  <Line
                    type="monotone"
                    dataKey="sma20"
                    stroke="hsl(var(--chart-secondary))"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                
                {showEMA && (
                  <Line
                    type="monotone"
                    dataKey="ema12"
                    stroke="hsl(var(--chart-accent))"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* RSI Chart */}
      {showRSI && (
        <Card>
          <CardHeader>
            <CardTitle>RSI (Relative Strength Index)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [parseFloat(value as string).toFixed(2), "RSI"]}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  
                  {/* Overbought/Oversold lines */}
                  <Line
                    type="monotone"
                    dataKey={() => 70}
                    stroke="hsl(var(--loss-color))"
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => 30}
                    stroke="hsl(var(--buy-color))"
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="rsi"
                    stroke="hsl(var(--chart-accent))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}