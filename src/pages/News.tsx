import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";

const newsData = [
  {
    id: 1,
    headline: "Apple Reports Record Q3 Earnings, Revenue Up 15% YoY",
    date: "2025-08-01",
    time: "16:30",
    sentiment: "positive",
    symbol: "AAPL",
    summary: "Apple Inc. exceeded analyst expectations with strong iPhone and services revenue growth.",
  },
  {
    id: 2,
    headline: "Tesla Announces Major Expansion of Supercharger Network",
    date: "2025-08-01",
    time: "14:45",
    sentiment: "positive",
    symbol: "TSLA",
    summary: "The electric vehicle maker plans to double its Supercharger stations by end of 2025.",
  },
  {
    id: 3,
    headline: "Microsoft Azure Revenue Growth Slows to 25% in Latest Quarter",
    date: "2025-08-01",
    time: "13:20",
    sentiment: "neutral",
    symbol: "MSFT",
    summary: "While still strong, Azure's growth rate has decelerated from previous quarters.",
  },
  {
    id: 4,
    headline: "Google Faces New Antitrust Investigation in European Union",
    date: "2025-08-01",
    time: "11:15",
    sentiment: "negative",
    symbol: "GOOGL",
    summary: "EU regulators are examining Google's advertising practices and market dominance.",
  },
  {
    id: 5,
    headline: "Amazon Web Services Launches New AI Infrastructure Products",
    date: "2025-08-01",
    time: "10:30",
    sentiment: "positive",
    symbol: "AMZN",
    summary: "AWS introduces specialized chips and services for machine learning workloads.",
  },
  {
    id: 6,
    headline: "NVIDIA Partners with Major Automakers for AI Chip Development",
    date: "2025-08-01",
    time: "09:45",
    sentiment: "positive",
    symbol: "NVDA",
    summary: "New partnerships aim to accelerate autonomous vehicle technology adoption.",
  },
  {
    id: 7,
    headline: "Federal Reserve Hints at Potential Rate Cut in September Meeting",
    date: "2025-07-31",
    time: "18:20",
    sentiment: "positive",
    symbol: "MARKET",
    summary: "Fed officials suggest monetary policy adjustments may be warranted given economic data.",
  },
  {
    id: 8,
    headline: "Semiconductor Shortage Shows Signs of Easing, Industry Report Shows",
    date: "2025-07-31",
    time: "16:40",
    sentiment: "positive",
    symbol: "TECH",
    summary: "Supply chain improvements and increased production capacity are alleviating shortages.",
  },
  {
    id: 9,
    headline: "Tesla Stock Faces Pressure After Production Target Miss",
    date: "2025-07-31",
    time: "15:10",
    sentiment: "negative",
    symbol: "TSLA",
    summary: "Company delivered fewer vehicles than expected due to supply chain challenges.",
  },
  {
    id: 10,
    headline: "Apple Suppliers Reduce Production Forecasts for iPhone 16",
    date: "2025-07-31",
    time: "12:30",
    sentiment: "negative",
    symbol: "AAPL",
    summary: "Weak consumer demand in key markets leads to production adjustments.",
  },
];

export default function News() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");

  const filteredNews = newsData.filter((news) => {
    const matchesSearch = 
      news.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSentiment = 
      sentimentFilter === "all" || news.sentiment === sentimentFilter;
    
    return matchesSearch && matchesSentiment;
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4" />;
      case "negative":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-profit hover:bg-profit/90 text-white";
      case "negative":
        return "bg-loss hover:bg-loss/90 text-white";
      default:
        return "bg-neutral hover:bg-neutral/90 text-white";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market News & Sentiment</h1>
        <p className="text-muted-foreground">Stay informed with the latest financial news and market sentiment</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search news, symbols, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiment</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredNews.map((news) => (
          <Card key={news.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight mb-2">
                    {news.headline}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(news.date)} at {news.time}
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {news.symbol}
                    </Badge>
                  </div>
                </div>
                <Badge 
                  className={`ml-4 flex items-center gap-1 ${getSentimentColor(news.sentiment)}`}
                >
                  {getSentimentIcon(news.sentiment)}
                  {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {news.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No news found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or sentiment filter
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}