import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

const team = [
  {
    name: "Z",
    role: "Founder",
    bio: "Just a guy to be honest. Won't put any credentials here because I don't have any and would rather let the product speak for itself. "
  },
]

const values = [
  {
    title: "Innovation",
    description: "We push the boundaries of what's possible with AI in financial markets, constantly exploring new approaches to strategy development and optimization."
  },
  {
    title: "Transparency",
    description: "We believe in complete transparency—in our technology, our pricing, and our communication. No hidden fees, no black boxes."
  },
  {
    title: "Security",
    description: "Your data and assets are protected by enterprise-grade security. We maintain the highest standards of data protection and operational security."
  },
  {
    title: "Education",
    description: "We're committed to helping users understand algorithmic trading. Our platform includes extensive documentation, tutorials, and research insights."
  }
]

const milestones = [
  {
    year: "2026",
    title: "Founded",
    description: "Zecant was founded with a mission to democratize algorithmic trading."
  },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  About Zecant
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We're building the future of algorithmic trading—making quantitative finance accessible to everyone.
                </p>
              </div>

              <div className="mb-16">
                <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Zecant was founded with a simple belief: the power of algorithmic trading should not be limited to hedge funds and institutional investors. We built a platform that lets anyone—from seasoned traders to curious beginners—create, test, and deploy trading strategies using natural language and cutting-edge AI.
                  </p>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {values.map((value, index) => (
                    <div key={index} className="bg-card rounded-lg border border-border p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Our Journey</h2>
                <div className="relative">
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-1/2" />
                  <div className="space-y-8">
                    {milestones.map((milestone, index) => (
                      <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                        <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2" />
                        <div className={`ml-12 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                          <div className="bg-card rounded-lg border border-border p-5">
                            <span className="text-primary font-semibold text-sm">{milestone.year}</span>
                            <h3 className="text-lg font-semibold text-foreground mt-1">{milestone.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{milestone.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Leadership Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {team.map((member, index) => (
                    <div key={index} className="bg-card rounded-lg border border-border p-6">
                      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                      <p className="text-primary text-sm mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Join Our Team</h2>
                <p className="text-muted-foreground mb-6">
                  We're always looking for talented individuals who share our passion for transforming finance through technology.
                </p>
                <a
                  href="mailto:careers@zecant.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  View Open Positions
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  )
}
