import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

const portfolioStats = [
  {
    title: "Total Portfolio Value",
    value: "$487,342.18",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Today's P&L",
    value: "+$3,247.85",
    change: "+0.67%",
    trend: "up" as const,
    icon: TrendingUp,
  },
  {
    title: "Total Positions",
    value: "24",
    change: "+2",
    trend: "up" as const,
    icon: BarChart3,
  },
  {
    title: "Available Cash",
    value: "$52,847.32",
    change: "-5.2%",
    trend: "down" as const,
    icon: DollarSign,
  },
];

const recentTrades = [
  { symbol: "AAPL", action: "BUY", quantity: 100, price: 175.32, time: "09:45 AM" },
  { symbol: "TSLA", action: "SELL", quantity: 50, price: 245.67, time: "10:22 AM" },
  { symbol: "MSFT", action: "BUY", quantity: 75, price: 412.89, time: "11:15 AM" },
  { symbol: "GOOGL", action: "SELL", quantity: 25, price: 2758.42, time: "14:30 PM" },
];

const topPerformers = [
  { symbol: "NVDA", return: "+15.7%", price: "$875.42", change: "+119.23" },
  { symbol: "AMZN", return: "+8.3%", price: "$178.92", change: "+13.74" },
  { symbol: "META", return: "+6.1%", price: "$487.63", change: "+28.05" },
  { symbol: "NFLX", return: "-2.4%", price: "$445.87", change: "-10.92" },
  { symbol: "AAPL", return: "-1.8%", price: "$175.32", change: "-3.21" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your portfolio performance and recent activity</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioStats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`text-xs flex items-center ${
                stat.trend === "up" ? "text-profit" : "text-loss"
              }`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stat.change} from yesterday
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      trade.action === "BUY" ? "bg-buy text-white" : "bg-sell text-white"
                    }`}>
                      {trade.action}
                    </div>
                    <div>
                      <div className="font-medium">{trade.symbol}</div>
                      <div className="text-sm text-muted-foreground">{trade.quantity} shares</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${trade.price}</div>
                    <div className="text-sm text-muted-foreground">{trade.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((stock, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium text-lg">{stock.symbol}</div>
                    <div className={`text-sm font-semibold ${
                      stock.return.startsWith("+") ? "text-profit" : "text-loss"
                    }`}>
                      {stock.return}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{stock.price}</div>
                    <div className={`text-sm ${
                      stock.change.startsWith("+") ? "text-profit" : "text-loss"
                    }`}>
                      {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}