import { 
    Search,
    TrendingUp,
    BarChart3,
    Calculator,
    FileText,
    FilePlus
  } from "lucide-react"

export interface Tool {
    id: string
    name: string
    description: string
    icon: React.ElementType
    enabled: boolean
}

export const lmtools: Tool[] = [
    {
    id: "search",
    name: "Search",
    description: "Search verified sources for information",
    icon: Search,
    enabled: false
    },
    {
    id: "graph",
    name: "Graph Generator",
    description: "Create charts and data visualizations",
    icon: TrendingUp,
    enabled: false
    },
    {
    id: "backtest",
    name: "Backtest",
    description: "Run trading strategy backtests",
    icon: BarChart3,
    enabled: false
    },
    {
    id: "calculator",
    name: "Calculator",
    description: "Perform complex financial calculations",
    icon: Calculator,
    enabled: false
    },
    {
    id: "docs",
    name: "Document Analysis",
    description: "Analyze and extract data from documents",
    icon: FileText,
    enabled: false
    },
    {
    id: "report",
    name: "Create Report",
    description: "Research and create a report",
    icon: FilePlus,
    enabled: false
    },
]