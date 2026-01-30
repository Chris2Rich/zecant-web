import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

interface UpdateEntry {
  version: string
  date: string
  title: string
  changes: string[]
  type: 'major' | 'minor' | 'patch'
}

const updateData: UpdateEntry[] = [
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

function getVersionColor(type: UpdateEntry['type']) {
  switch (type) {
    case 'major':
      return 'bg-green-500'
    case 'minor':
      return 'bg-blue-500'
    case 'patch':
      return 'bg-orange-500'
    default:
      return 'bg-gray-500'
  }
}

export default function UpdatesPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  Update <span className="text-primary">History</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                  Stay up to date with the latest features, improvements, and bug fixes.
                </p>
              </div>

              <div className="space-y-8">
                {updateData.map((update, index) => (
                  <div key={update.version} className="relative">
                    {/* Timeline line */}
                    {index < updateData.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-border" />
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Version indicator */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getVersionColor(update.type)} flex items-center justify-center text-white font-semibold text-sm`}>
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
                                <span className="text-primary mt-1.5">•</span>
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
