import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  resources: [{text: "Updates", link: "/updates"}, {text: "Documentation", link: "/documentation"}, {text: "Research", link: "/research"}],
  company: [{text: "About Us", link: "/"},  {text: "Careers", link: "mailto:support@zecant.com"}, {text: "Support", link: "mailto:support@zecant.com"}, {text: "Support", link: "mailto:support@zecant.com"}],
  legal: [{text: "Privacy Policy", link: "/"}, {text: "Terms of Service", link: "/"}, {text: "Risk Disclosure", link: "/"}, {text: "Regulatory Info", link: "/"}, {text: "Security", link: "/"}, {text: "Complianc ", link: "/"}],
}

const socialLinks = [
  { svg: "https://simpleicons.org/icons/discord.svg", href: "https://discord.gg/KcyHwZWyZa", label: "Discord" },
]

export function Footer() {
  return (
    <footer className="bg-card/70 backdrop-blur-glass border-t border-border-divider">
      <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row justify-between gap-12">          
        {/* Company Info */}
          <div className="max-w-sm lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                <Image 
                  src="/Wordmark.png" 
                  alt="Zecant" 
                  width={120} 
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </div>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/95 hover:inner-light-subtle transition-all duration-300 "
                  aria-label={social.label}
                >
                  <svg href={social.svg} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12 lg:gap-16 lg:ml-auto">

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.link}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.link}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.link}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border-divider mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">© 2026 Zecant. All rights reserved.</div>
            <div className="text-muted-foreground text-xs max-w-md text-center md:text-right">
              Trading involves substantial risk of loss and is not suitable for all investors. Past performance is not
              indicative of future results.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
