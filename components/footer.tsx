import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  resources: [
    {text: "Updates", link: "/updates"},
    {text: "Documentation", link: "/docs"},
    {text: "Research", link: "/research"}
  ],
  company: [
    {text: "About Us", link: "/about"},
    {text: "Careers", link: "mailto:careers@zecant.com"},
    {text: "Support", link: "mailto:support@zecant.com"}
  ],
  legal: [
    {text: "Privacy Policy", link: "/legal#privacy-policy"},
    {text: "Terms of Service", link: "/legal#terms-of-service"},
    {text: "Risk Disclosure", link: "/legal#risk-disclosure"},
    {text: "Regulatory Info", link: "/legal#regulatory-info"},
    {text: "Security", link: "/legal#security"},
    {text: "Compliance", link: "/legal#compliance"}
  ],
}

const Discord = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
<path d="M19.888 7.335a5.134 5.134 0 0 0-2.893-2.418a9.144 9.144 0 0 0-2.275-.508a9.963 9.963 0 0 0-.508 1.038a15.039 15.039 0 0 0-4.56 0a11.372 11.372 0 0 0-.519-1.038c-.752.082-1.493.249-2.208.497a5.123 5.123 0 0 0-2.904 2.44a16.176 16.176 0 0 0-1.91 9.717a16.562 16.562 0 0 0 4.98 2.528a4.339 4.339 0 0 0 1.104-1.777c-.54-.202-1.06-.45-1.557-.74c-.089-.122.254-.32.364-.354a11.826 11.826 0 0 0 10.037 0c.1 0 .453.232.364.354c-.441.342-1.424.585-1.59.828a7.4 7.4 0 0 0 1.105 1.69a16.628 16.628 0 0 0 4.99-2.53a16.232 16.232 0 0 0-2.02-9.727M8.669 14.7a1.943 1.943 0 0 1-1.92-1.955a1.943 1.943 0 0 1 1.92-1.91a1.942 1.942 0 0 1 1.933 1.965a1.943 1.943 0 0 1-1.933 1.9m6.625 0a1.943 1.943 0 0 1-1.932-1.944a1.932 1.932 0 1 1 3.865.034a1.932 1.932 0 0 1-1.933 1.899z"></path>
</svg>
)

const X = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
<path d="M17.751 3h3.067l-6.7 7.625L22 21h-6.172l-4.833-6.293L5.464 21h-3.07l7.167-8.155L2 3h6.328l4.37 5.752zm-1.076 16.172h1.7L7.404 4.732H5.58z"></path>
</svg>
)

const socialLinks = [
  { icon: Discord, href: "https://discord.gg/KcyHwZWyZa", label: "Discord" },
  { icon: X, href: "https://x.com/zecantofficial", label: "X" },
]

export function Footer() {
  return (
    <footer className="bg-card/70 backdrop-blur-glass border-t border-border-divider">
      <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row justify-between gap-12">          
        {/* Company Info */}
          <div className="max-w-sm lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 text-muted-foreground">
                Join and follow Zecant's official socials.
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/95 hover:inner-light-subtle transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon />
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
