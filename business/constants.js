export const pricingTiers = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "0",
      period: "/month",
      credits: "3",
      discount: "",
      features: [
        "Historical data (1 year)",
        "Community support",
        "Basic analytics dashboard",
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
        "Historical data (10+ years)",
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
      cta: "Contact Sales",
      highlighted: false,
    },
  ]

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