import { 
    FilePlus,
    ChartCandlestick,
    FolderSearch,
    Globe,
    ChartPie,
    TrendingUpDown
  } from "lucide-react"

export interface Tool {
    id: string
    name: string
    description: string
    icon: React.ElementType
    enabled: boolean
    premium: boolean
}

export const lmtools: Tool[] = [
    {
    id: "search",
    name: "Search",
    description: "Search the internet to improve responses",
    icon: Globe,
    enabled: true,
    premium: false
    },
    {
    id: "adv_search",
    name: "Advanced Search",
    description: "Search through trusted news sources, SEC filings and more",
    icon: FolderSearch,
    enabled: false,
    premium: true
    },
    {
    id: "market_data",
    name: "Market Data",
    description: "Use real market data to improve responses",
    icon: ChartCandlestick,
    enabled: true,
    premium: false
    },
    {
    id: "portfolio",
    name: "Portfolio Data",
    description: "Use your portfolio as context",
    icon: ChartCandlestick,
    enabled: true,
    premium: false
    },
    {
    id: "stock_chart",
    name: "Market Panel",
    description: "Interactive graphs showing historical market data",
    icon: ChartPie,
    enabled: true,
    premium: false
    },
    {
    id: "graph",
    name: "Graph Generator",
    description: "Create charts and data visualizations",
    icon: ChartPie,
    enabled: true,
    premium: false
    },
    {
    id: "backtest",
    name: "Backtest",
    description: "Run simple backtests",
    icon: TrendingUpDown,
    enabled: false,
    premium: false
    },
    {
    id: "adv_backtest",
    name: "Advanced Backtest",
    description: "Create powerful and robust trading models",
    icon: TrendingUpDown,
    enabled: false,
    premium: true
    },
    {
    id: "adv_report",
    name: "Advanced Report",
    description: "Synthesize reports that fit your firm",
    icon: FilePlus,
    enabled: false,
    premium: true
    },
    {
    id: "report",
    name: "Report",
    description: "Research and create a report",
    icon: FilePlus,
    enabled: false,
    premium: false
    },
]