export const pricingTiers = [
    {
      name: "Free",
      description: "Perfect for testing",
      price: "0",
      period: "/month",
      credits: "3",
      discount: "",
      features: [
        "Historical data (1 year)",
        "Community support",
        "Basic analytics dashboard",
        "Access to ZECA",
        "Portfolio management tools"
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Plus",
      description: "For serious traders",
      price: "20",
      period: "/month",
      credits: "50",
      badge: "Most Popular",
      features: [
        "Historical data (2+ years)",
        "AI enhanced strategy optimization",
        "Custom indicators & signals",
        "Automatic Reporting",
        "Bring your own key",
        "Bring your own data",
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Pro",
      description: "For powerful workflows",
      price: "200",
      period: "/month",
      credits: "650",
      discount: "5",
      badge: "Best Value",
      features: [
        "Everything in Plus",
        "Historical data (5+ years)",
        "Faster generations",
        "Priority email support",
        "Advanced analytics & reporting",
        "API access",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Enterprise",
      description: "For professional teams",
      price: "1000",
      credits: "3500",
      discount: "10",
      period: "/month",
      features: [
        "Everything in Pro",
        "Advanced security & compliance",
        "Team collaboration tools",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Get Started",
      highlighted: false,
    },
  ]

  export const pricingTiersTable = {
    dataAccess: {
      label: "Data Access",
      items: {
        historicalData: {
          label: "Historical Data",
          Free: "1 year",
          Plus: "2+ years",
          Pro: "5+ years",
          Enterprise: "5+ years",
        },
      },
    },
  
    analyticsAndTools: {
      label: "Analytics & Tools",
      items: {
        basicAnalytics: {
          label: "Analytics Dashboard",
          Free: true,
          Plus: true,
          Pro: true,
          Enterprise: true,
        },
        advancedAnalytics: {
          label: "Advanced Analytics & Reporting",
          Free: false,
          Plus: false,
          Pro: true,
          Enterprise: true,
        },
        aiStrategyOptimization: {
          label: "AI Enhanced Strategy Optimization",
          Free: false,
          Plus: true,
          Pro: true,
          Enterprise: true,
        },
        customIndicators: {
          label: "Custom Indicators & Signals",
          Free: false,
          Plus: true,
          Pro: true,
          Enterprise: true,
        },
        portfolioManagement: {
          label: "Portfolio Management Tools",
          Free: true,
          Plus: true,
          Pro: true,
          Enterprise: true,
        },
        fasterGenerations: {
          label: "Faster Generations",
          Free: false,
          Plus: false,
          Pro: true,
          Enterprise: true,
        },
      },
    },
  
    integrations: {
      label: "Integrations",
      items: {
        bringYourOwnKey: {
          label: "Bring Your Own Key",
          Free: false,
          Plus: true,
          Pro: true,
          Enterprise: true,
        },
        bringYourOwnData: {
          label: "Bring Your Own Data",
          Free: false,
          Plus: true,
          Pro: true,
          Enterprise: true,
        },
        apiAccess: {
          label: "API Access",
          Free: false,
          Plus: false,
          Pro: true,
          Enterprise: true,
        },
        customIntegrations: {
          label: "Custom Integrations",
          Free: false,
          Plus: false,
          Pro: false,
          Enterprise: true,
        },
      },
    },
  
    platformAndSupport: {
      label: "Platform & Support",
      items: {
        accessToZECA: {
          label: "Access to ZECA",
          Free: true,
          Plus: true,
          Pro: true,
          Enterprise: true,
        },
        communitySupport: {
          label: "Community Support",
          Free: true,
          Plus: true,
          Pro: true,
          Enterprise: true,
        },
        priorityEmailSupport: {
          label: "Priority Email Support",
          Free: false,
          Plus: false,
          Pro: true,
          Enterprise: true,
        },
        teamCollaboration: {
          label: "Team Collaboration Tools",
          Free: false,
          Plus: false,
          Pro: false,
          Enterprise: true,
        },
        securityCompliance: {
          label: "Advanced Security & Compliance",
          Free: false,
          Plus: false,
          Pro: false,
          Enterprise: true,
        },
        slaGuarantee: {
          label: "SLA Guarantee",
          Free: false,
          Plus: false,
          Pro: false,
          Enterprise: true,
        },
      },
    },
  };
  

  export const billingTiers = {
    Free: {
      priceId: null,
      credits: 3,
    },
    Plus: {
      priceId: "price_1SNu58JfEi0Dfj0EReSYSb5t", // $20/mo
      credits: 50,
    },
    Pro: {
      priceId: "price_1SNuHdJfEi0Dfj0EbRgYBxM8", // $200/mo
      credits: 650,
    },
    Enterprise: {
      priceId: "price_1SNuHdJfEi0Dfj0EoP9WCuFX", // $1000/mo
      credits: 3500,
    },
  };

export const defaultChatOptions = [
    "What is the purpose of covariance matrices in portfolio optimisation?",
    "Model the effect of interest rates on the valuation of the MAG7.",
    "Analyse the latest price action of recent IPOs and discover the causes.",
    "What are the factors that could cause US employment to fall?",
  ]

export const releaseData = [
  {
    version: '0.1',
    date: 'Current Version',
    title: 'Test version',
    type: 'minor',
    changes: [
      'Test features and functionality',
      'Bug fixes and improvements',
      'User feedback integration'
    ]
  },
  {
    version: '0.0',
    date: 'Current Version',
    title: 'First Version',
    type: 'major',
    changes: [
      'Core trading platform functionality',
      'Basic portfolio management',
      'Essential analytics and reporting'
    ]
  }
]
