import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

const legalSections = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    lastUpdated: "January 15, 2026",
    content: [
      {
        type: "paragraph",
        text: "At Zecant, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform."
      },
      {
        type: "heading",
        text: "Information We Collect"
      },
      {
        type: "paragraph",
        text: "We collect information that you provide directly to us, including: account information (name, email, phone number), identity verification documents, trading data from connected accounts, usage data and analytics, and communication preferences."
      },
      {
        type: "heading",
        text: "How We Use Your Information"
      },
      {
        type: "paragraph",
        text: "We use the information we collect to: provide and improve our services, process your transactions, communicate with you about updates and offers, verify your identity and comply with legal obligations, and protect against fraud and unauthorized access."
      },
      {
        type: "heading",
        text: "Data Protection"
      },
      {
        type: "paragraph",
        text: "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest using industry-standard encryption protocols."
      },
      {
        type: "heading",
        text: "Your Rights"
      },
      {
        type: "paragraph",
        text: "You have the right to access, correct, or delete your personal information. You may also opt-out of certain data collection or processing activities. To exercise these rights, contact us at support@zecant.com."
      },
      {
        type: "heading",
        text: "Contact Us"
      },
      {
        type: "paragraph",
        text: "If you have questions about this Privacy Policy, please contact us at support@zecant.com or through our Discord community."
      }
    ]
  },
  {
    id: "terms-of-service",
    title: "Terms of Service",
    lastUpdated: "January 15, 2026",
    content: [
      {
        type: "paragraph",
        text: "Welcome to Zecant. By accessing and using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
      },
      {
        type: "heading",
        text: "Acceptable Use"
      },
      {
        type: "paragraph",
        text: "You agree to use our platform only for lawful purposes and in accordance with these Terms. You shall not: attempt to gain unauthorized access to any systems, violate any applicable laws or regulations, transmit malicious code or viruses, or engage in any activity that interferes with or disrupts our services."
      },
      {
        type: "heading",
        text: "Account Responsibilities"
      },
      {
        type: "paragraph",
        text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use or security breaches."
      },
      {
        type: "heading",
        text: "Intellectual Property"
      },
      {
        type: "paragraph",
        text: "All content, features, and functionality of our platform are owned by Zecant and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our services without our prior written consent."
      },
      {
        type: "heading",
        text: "Limitation of Liability"
      },
      {
        type: "paragraph",
        text: "Zecant shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services. Our total liability shall not exceed the amount paid by you, if any, for using our services."
      },
      {
        type: "heading",
        text: "Changes to Terms"
      },
      {
        type: "paragraph",
        text: "We reserve the right to modify these Terms at any time. We will provide notice of material changes via email or through our platform. Your continued use of our services after such modifications constitutes acceptance of the updated Terms."
      }
    ]
  },
  {
    id: "risk-disclosure",
    title: "Risk Disclosure",
    lastUpdated: "January 15, 2026",
    content: [
      {
        type: "paragraph",
        text: "Trading financial instruments involves substantial risk of loss and may not be suitable for all investors. Before using Zecant, you should carefully consider your investment objectives, level of experience, and risk tolerance."
      },
      {
        type: "heading",
        text: "No Investment Advice"
      },
      {
        type: "paragraph",
        text: "Zecant provides tools for strategy development and backtesting but does not provide investment advice. Any strategies generated through our platform are for educational and informational purposes only. You are solely responsible for all investment decisions."
      },
      {
        type: "heading",
        text: "Past Performance"
      },
      {
        type: "paragraph",
        text: "Past performance is not indicative of future results. Backtested results may not reflect actual trading and may be affected by hindsight bias. Historical performance does not guarantee future profits."
      },
      {
        type: "heading",
        text: "Leverage and Margin"
      },
      {
        type: "paragraph",
        text: "Trading on margin involves borrowing money to invest, which can amplify both gains and losses. You may lose more than your initial investment. Leveraged trading significantly increases your risk of substantial loss."
      },
      {
        type: "heading",
        text: "Market Risks"
      },
      {
        type: "paragraph",
        text: "Financial markets can be extremely volatile. Prices of securities, currencies, and other instruments can fluctuate rapidly and significantly. This volatility can result in rapid and substantial losses."
      },
      {
        type: "heading",
        text: "Technology Risks"
      },
      {
        type: "paragraph",
        text: "Trading systems and algorithms can experience technical failures, delays, or errors. Electronic trading involves risks including, but not limited to, hardware failures, software bugs, network interruptions, and connectivity issues."
      },
      {
        type: "heading",
        text: "No Guarantees"
      },
      {
        type: "paragraph",
        text: "Zecant does not guarantee any specific outcomes or profits. There is no assurance that any strategy will be successful. You should only trade with capital you can afford to lose entirely."
      }
    ]
  },
  {
    id: "regulatory-info",
    title: "Regulatory Information",
    lastUpdated: "January 15, 2026",
    content: [
      {
        type: "paragraph",
        text: "Zecant is a technology platform that provides tools for developing and backtesting trading strategies. We are not a registered investment advisor, broker-dealer, or financial institution."
      },
      {
        type: "heading",
        text: "Platform Status"
      },
      {
        type: "paragraph",
        text: "Zecant provides software-as-a-service tools for quantitative analysis and strategy development. We do not execute trades on behalf of users, manage client funds, or provide personalized investment advice."
      },
      {
        type: "heading",
        text: "Regional Availability"
      },
      {
        type: "paragraph",
        text: "Our platform is available to users in select jurisdictions. Certain features may not be available in all regions due to regulatory restrictions. It is your responsibility to ensure compliance with local laws and regulations."
      },
      {
        type: "heading",
        text: "Third-Party Services"
      },
      {
        type: "paragraph",
        text: "Zecant may integrate with third-party exchanges and financial institutions. These third parties are regulated separately and Zecant is not responsible for their actions, services, or compliance."
      },
      {
        type: "heading",
        text: "Regulatory Disclosures"
      },
      {
        type: "paragraph",
        text: "We are committed to transparency and regulatory compliance where applicable. For regulatory inquiries, please contact us at support@zecant.com."
      }
    ]
  },
  {
    id: "security",
    title: "Security",
    lastUpdated: "January 15, 2026",
    content: [
      {
        type: "paragraph",
        text: "Security is foundational to everything we build at Zecant. We employ multiple layers of protection to safeguard your data and assets."
      },
      {
        type: "heading",
        text: "Encryption"
      },
      {
        type: "paragraph",
        text: "All data is encrypted using AES-256 encryption at rest and TLS 1.3 in transit. API keys and sensitive credentials are encrypted with hardware security modules (HSMs)."
      },
      {
        type: "heading",
        text: "Authentication"
      },
      {
        type: "paragraph",
        text: "We use Clerk for secure authentication with multi-factor authentication (MFA) support. All sessions are encrypted and monitored for suspicious activity."
      },
      {
        type: "heading",
        text: "Infrastructure"
      },
      {
        type: "paragraph",
        text: "Our infrastructure is hosted on secure cloud providers with SOC 2 Type II compliant data centers. We utilize network segmentation, firewalls, and intrusion detection systems."
      },
      {
        type: "heading",
        text: "Access Controls"
      },
      {
        type: "paragraph",
        text: "We implement the principle of least privilege. Internal access is role-based and audited regularly. Employee access to user data is strictly limited and logged."
      },
      {
        type: "heading",
        text: "Vulnerability Management"
      },
      {
        type: "paragraph",
        text: "We conduct regular security audits, penetration testing, and vulnerability scans. We maintain a responsible disclosure program and promptly address identified vulnerabilities."
      },
      {
        type: "heading",
        text: "Incident Response"
      },
      {
        type: "paragraph",
        text: "We have a documented incident response plan and maintain 24/7 monitoring. In the event of a security incident, we will notify affected users as required by applicable law."
      },
      {
        type: "heading",
        text: "Your Role"
      },
      {
        type: "paragraph",
        text: "Enable MFA on your account, use strong unique passwords, never share credentials, and report suspicious activity immediately to security@zecant.com."
      }
    ]
  },
  {
    id: "compliance",
    title: "Compliance",
    lastUpdated: "January 15, 2026",
    content: [
      {
        type: "paragraph",
        text: "Zecant is committed to maintaining the highest standards of compliance and ethics. We continuously work to ensure our platform meets applicable regulatory requirements."
      },
      {
        type: "heading",
        text: "Anti-Money Laundering (AML)"
      },
      {
        type: "paragraph",
        text: "We have implemented robust AML controls including know-your-customer (KYC) procedures, transaction monitoring, and suspicious activity reporting. We cooperate with relevant authorities as required."
      },
      {
        type: "heading",
        text: "Know Your Customer (KYC)"
      },
      {
        type: "paragraph",
        text: "We verify user identities in accordance with applicable regulations. This includes collecting and verifying identification documents, as well as ongoing monitoring of high-risk accounts."
      },
      {
        type: "heading",
        text: "Sanctions Compliance"
      },
      {
        type: "paragraph",
        text: "Zecant strictly complies with all applicable sanctions regulations. We do not provide services to individuals or entities located in sanctioned jurisdictions or on sanctioned party lists."
      },
      {
        type: "heading",
        text: "Data Retention"
      },
      {
        type: "paragraph",
        text: "We retain user data only as long as necessary for service provision and legal compliance. Data retention policies are reviewed regularly to ensure compliance with applicable data protection laws."
      },
      {
        type: "heading",
        text: "Audit and Monitoring"
      },
      {
        type: "paragraph",
        text: "Our compliance program includes regular internal audits, external assessments, and continuous monitoring. We maintain detailed logs and documentation for regulatory examination."
      },
      {
        type: "heading",
        text: "Reporting"
      },
      {
        type: "paragraph",
        text: "For compliance inquiries or to report concerns, please contact compliance@zecant.com. We take all compliance matters seriously and investigate all reported issues."
      }
    ]
  }
]

function LegalSection({ section, index }: { section: typeof legalSections[0], index: number }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="bg-card rounded-lg border border-border p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
          <span className="text-sm text-muted-foreground">Last Updated: {section.lastUpdated}</span>
        </div>
        <div className="space-y-6">
          {section.content.map((item, itemIndex) => {
            if (item.type === "heading") {
              return (
                <h3 key={itemIndex} className="text-lg font-medium text-foreground pt-2">
                  {item.text}
                </h3>
              )
            }
            return (
              <p key={itemIndex} className="text-muted-foreground leading-relaxed">
                {item.text}
              </p>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Legal & Compliance</h1>
                <p className="text-lg text-muted-foreground">
                  Important information about your use of the Zecant platform.
                </p>
              </div>

              <nav className="mb-12">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex flex-wrap gap-2">
                    {legalSections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </div>
                </div>
              </nav>

              <div className="space-y-8">
                {legalSections.map((section, index) => (
                  <LegalSection key={section.id} section={section} index={index} />
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground">
                  Questions about our legal policies?{' '}
                  <a href="mailto:support@zecant.com" className="text-primary hover:underline">
                    Contact Support
                  </a>
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
