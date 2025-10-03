import { Shield, Zap, Headphones } from "lucide-react"

const reasons = [
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Bank-grade encryption, regulatory compliance, and SIPC protection for your peace of mind.",
    metric: "256-bit SSL encryption",
  },
  {
    icon: Zap,
    title: "Performance & Speed",
    description: "Sub-millisecond execution, 99.9% uptime, and direct market access for optimal trading.",
    metric: "<1ms latency",
  },
  {
    icon: Headphones,
    title: "Support & Reliability",
    description: "24/7 expert support, comprehensive documentation, and dedicated account management.",
    metric: "24/7 availability",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">Zecant</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of professional traders who trust Zecant for their most important trades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group p-8 bg-card/30 rounded-2xl border border-border hover:border-primary/50 hover:bg-card/50 transition-all duration-300 hover:glow-primary"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors duration-300">
                  <reason.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-foreground leading-relaxed mb-4">{reason.description}</p>
                <div className="text-primary font-semibold text-sm">{reason.metric}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
