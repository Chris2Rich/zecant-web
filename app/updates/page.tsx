interface UpdateEntry {
  version: string
  date: string
  title: string
  changes: string[]
  type: 'major' | 'minor' | 'patch'
}

const updateData: UpdateEntry[] = [
  {
    version: '1.2.0',
    date: 'January 30, 2026',
    title: 'Major Platform Enhancements',
    type: 'major',
    changes: [
      'Introduced advanced portfolio analytics with real-time risk metrics',
      'Added support for custom strategy backtesting',
      'Improved chat interface with enhanced AI responses',
      'New notification system for market alerts'
    ]
  },
  {
    version: '1.1.5',
    date: 'January 25, 2026',
    title: 'Bug Fixes and Performance Improvements',
    type: 'patch',
    changes: [
      'Fixed chart rendering issues on mobile devices',
      'Resolved memory leaks in strategy simulation',
      'Improved loading times for large datasets',
      'Enhanced error handling for API connections'
    ]
  },
  {
    version: '1.1.0',
    date: 'January 20, 2026',
    title: 'Strategy Library Expansion',
    type: 'minor',
    changes: [
      'Added 15+ new pre-built trading strategies',
      'Introduced strategy cloning and modification tools',
      'New performance comparison charts',
      'Enhanced strategy documentation'
    ]
  },
  {
    version: '1.0.5',
    date: 'January 15, 2026',
    title: 'User Interface Improvements',
    type: 'patch',
    changes: [
      'Redesigned dashboard with improved navigation',
      'Added dark mode support throughout the platform',
      'Enhanced mobile responsiveness',
      'New keyboard shortcuts for power users'
    ]
  },
  {
    version: '1.0.0',
    date: 'January 10, 2026',
    title: 'Platform Launch',
    type: 'major',
    changes: [
      'Initial release of Zecant trading platform',
      'Core features: portfolio tracking, strategy building, AI chat',
      'Integration with major brokers and data providers',
      'Comprehensive documentation and tutorials'
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Update History</h1>
        <p className="text-lg text-muted-foreground">
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
  )
}