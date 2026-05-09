// components/layout/Footer.tsx
'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Tools', href: '/tools' },
      { name: 'Blog', href: '/blog' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '/docs' },
      { name: 'FAQ', href: '/faq' },
      { name: 'API', href: '/api' },
      { name: 'Status', href: 'https://status.example.com' },
    ],
  },
]

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { name: 'Email', icon: Mail, href: 'mailto:contact@example.com' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      {/* Main footer content */}
      <div className="container-lg mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center space-x-2 font-bold text-lg text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
            >
              <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-slate-900 font-bold text-sm">ID</span>
              </div>
              <span>Indie Tools</span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Free online tools and AI utilities for developers and creators.
            </p>
            {/* Social links */}
            <div className="flex items-center space-x-4 pt-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
          {/* Support section */}
          <div className="mb-8">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Support the project
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              If you find these tools useful, consider supporting the development.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                <Heart className="w-4 h-4" />
                <span>Donate</span>
              </a>
              <a
                href="https://github.com/sponsor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                <span>Sponsor</span>
              </a>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                © {currentYear} Indie Tools. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <a
                  href="/privacy"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
