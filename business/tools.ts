import { 
    Search,
    TrendingUp,
    BarChart3,
    Calculator,
    FileText,
    FilePlus,
    ChartCandlestick,
    FolderSearch,
    Globe
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
    name: "Basic Search",
    description: "Search the internet for up to date information",
    icon: Globe,
    enabled: true,
    premium: false
    },
    {
    id: "advsearch",
    name: "Advanced Search",
    description: "Search through trusted news sources, SEC filings and more",
    icon: FolderSearch,
    enabled: false,
    premium: true
    },
    {
    id: "stock_chart",
    name: "Market Info",
    description: "Interactive embedded financial diagrams",
    icon: ChartCandlestick,
    enabled: true,
    premium: false
    },
    {
    id: "graph",
    name: "Graph Generator",
    description: "Create charts and data visualizations",
    icon: TrendingUp,
    enabled: false,
    premium: false
    },
    {
    id: "backtest",
    name: "Backtest",
    description: "Run trading strategy backtests",
    icon: BarChart3,
    enabled: false,
    premium: false
    },
    {
    id: "advbacktest",
    name: "Advanced Backtest",
    description: "Create powerful trading models",
    icon: BarChart3,
    enabled: false,
    premium: true
    },
    {
    id: "calculator",
    name: "Calculator",
    description: "Perform complex financial calculations",
    icon: Calculator,
    enabled: false,
    premium: false
    },
    {
    id: "report",
    name: "Create Report",
    description: "Research and create a report",
    icon: FilePlus,
    enabled: false,
    premium: false
    },
]