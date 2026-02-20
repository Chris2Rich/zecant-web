import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { releaseData } from "@/business/constants"

interface UpdateEntry {
  version: string
  date: string
  title: string
  changes: string[]
  type: 'major' | 'minor'
}

function getVersionColor(type: UpdateEntry['type']) {
  switch (type) {
    case 'major':
      return 'bg-primary text-foreground'
    case 'minor':
      return 'bg-muted text-foreground'
    default:
      return 'bg-muted text-foreground'
  }
}

export default function UpdatesPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-4">Update History</h1>
                <p className="text-lg text-muted-foreground">
                  Stay up to date with the latest features, improvements, and bug fixes.
                </p>
              </div>

              <div className="space-y-8">
                {releaseData.map((update, index) => (
                  <div key={update.version} className="relative">
                    {/* Timeline line */}
                    {index < releaseData.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-border" />
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Version indicator */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getVersionColor(update.type as UpdateEntry['type'])} flex items-center justify-center text-white font-semibold text-sm`}>
                        {update.version.split('.')[0]}.{update.version.split('.')[1]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="bg-card rounded-lg border border-border p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">
                              Version {update.version}
                            </h2>
                            <span className="text-sm text-muted-foreground">
                              {update.date}
                            </span>
                          </div>

                          <h3 className="text-lg font-medium text-foreground mb-4">
                            {update.title}
                          </h3>

                          <ul className="space-y-2">
                            {update.changes.map((change, changeIndex) => (
                              <li key={changeIndex} className="flex items-start space-x-2">
                                <span className="text-foreground mt-1.5">•</span>
                                <span className="text-muted-foreground">{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground">
                  Want to see what's coming next? Check out our{' '}
                  <a href="/docs" className="text-primary hover:underline">
                    documentation
                  </a>{' '}
                  for upcoming features.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  )
}
