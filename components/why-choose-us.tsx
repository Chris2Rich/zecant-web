import { Shield, Zap, Headphones } from "lucide-react"

const reasons = [
  {
    icon: Shield,
    title: "Security",
    description: "Bank-grade encryption, regulatory compliance, and SIPC protection for your peace of mind.",
    metric: "256-bit SSL encryption",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Sub-millisecond execution, 99.9% uptime, and direct market access for optimal trading.",
    metric: "<1ms latency",
  },
  {
    icon: Headphones,
    title: "Support",
    description: "24/7 expert support, comprehensive documentation, and dedicated account management.",
    metric: "24/7 availability",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Zecant?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Zecant is a one of a kind solution that leverages emerging technologies to empower traders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group p-6 rounded-sm hover:-translate-y-2 bg-card/70 backdrop-blur-glass border transition-all duration-300 border-border-divider hover:border-primary/50 hover:inner-light-subtle"
            >
              <div className="mb-6">
              <div className="mb-4">
                <reason.icon className="w-8 h-8 text-primary group-hover:text-primary/95 transition-colors duration-300" />
              </div>
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{reason.description}</p>
                <div className="text-primary font-semibold text-sm">{reason.metric}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
