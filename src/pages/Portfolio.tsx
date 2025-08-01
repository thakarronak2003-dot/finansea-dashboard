import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const portfolioData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 150,
    avgBuyPrice: 165.42,
    currentPrice: 175.32,
    totalValue: 26298,
    plAmount: 1485,
    plPercent: 5.98,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    quantity: 75,
    avgBuyPrice: 238.15,
    currentPrice: 245.67,
    totalValue: 18425.25,
    plAmount: 564,
    plPercent: 3.16,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    quantity: 100,
    avgBuyPrice: 408.90,
    currentPrice: 412.89,
    totalValue: 41289,
    plAmount: 399,
    plPercent: 0.98,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 15,
    avgBuyPrice: 2801.33,
    currentPrice: 2758.42,
    totalValue: 41376.3,
    plAmount: -643.65,
    plPercent: -1.53,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    quantity: 200,
    avgBuyPrice: 172.45,
    currentPrice: 178.92,
    totalValue: 35784,
    plAmount: 1294,
    plPercent: 3.75,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    quantity: 50,
    avgBuyPrice: 789.23,
    currentPrice: 875.42,
    totalValue: 43771,
    plAmount: 4309.5,
    plPercent: 10.92,
  },
];

export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredData = portfolioData.filter((item) => {
    const matchesSearch = 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "gainers" && item.plPercent > 0) ||
      (filter === "losers" && item.plPercent < 0);
    
    return matchesSearch && matchesFilter;
  });

  const totalPortfolioValue = portfolioData.reduce((sum, item) => sum + item.totalValue, 0);
  const totalPL = portfolioData.reduce((sum, item) => sum + item.plAmount, 0);
  const totalPLPercent = (totalPL / (totalPortfolioValue - totalPL)) * 100;

  const handleExportCSV = () => {
    const headers = ["Symbol", "Name", "Quantity", "Avg Buy Price", "Current Price", "Total Value", "P&L Amount", "P&L %"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(item => [
        item.symbol,
        `"${item.name}"`,
        item.quantity,
        item.avgBuyPrice,
        item.currentPrice,
        item.totalValue,
        item.plAmount,
        item.plPercent.toFixed(2)
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Portfolio data has been exported to CSV",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">Track your holdings and performance</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPL >= 0 ? "text-profit" : "text-loss"}`}>
              {totalPL >= 0 ? "+" : ""}${totalPL.toLocaleString()}
            </div>
            <div className={`text-sm flex items-center ${totalPL >= 0 ? "text-profit" : "text-loss"}`}>
              {totalPL >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {totalPL >= 0 ? "+" : ""}{totalPLPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.length}</div>
            <div className="text-sm text-muted-foreground">Active positions</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search securities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="gainers">Gainers</SelectItem>
              <SelectItem value="losers">Losers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Portfolio Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Security</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Avg Buy Price</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">P&L %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{item.symbol}</div>
                        <div className="text-sm text-muted-foreground">{item.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.avgBuyPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${item.totalValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={item.plAmount >= 0 ? "text-profit" : "text-loss"}>
                        {item.plAmount >= 0 ? "+" : ""}${Math.abs(item.plAmount).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={item.plPercent >= 0 ? "default" : "destructive"}
                        className={`${
                          item.plPercent >= 0 
                            ? "bg-profit hover:bg-profit/90" 
                            : "bg-loss hover:bg-loss/90"
                        } text-white`}
                      >
                        {item.plPercent >= 0 ? "+" : ""}{item.plPercent.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}