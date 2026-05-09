// app/(marketing)/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Code2, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Free online tools and AI utilities for developers, designers, and creators.',
}

// Featured tools data
const featuredTools = [
  {
    id: 'ai-blog-generator',
    name: 'AI Blog Generator',
    description: 'Generate blog posts powered by GPT-4',
    icon: '✨',
    category: 'AI',
  },
  {
    id: 'youtube-summarizer',
    name: 'YouTube Summarizer',
    description: 'Get summaries of YouTube videos in seconds',
    icon: '📹',
    category: 'Video',
  },
  {
    id: 'color-palette',
    name: 'Color Palette Generator',
    description: 'Create beautiful color palettes instantly',
    icon: '🎨',
    category: 'Design',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images without losing quality',
    icon: '📸',
    category: 'Image',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON instantly',
    icon: '{ }',
    category: 'Dev',
  },
  {
    id: 'svg-encoder',
    name: 'SVG Encoder',
    description: 'Encode SVGs for web use',
    icon: '📐',
    category: 'Dev',
  },
]

// Currently building section
const currentlyBuilding = [
  {
    title: 'AI Caption Generator',
    description: 'Generate captions for your images with AI',
    status: 'In Progress',
    releaseDate: 'Q2 2024',
  },
  {
    title: 'Smart Meta Preview',
    description: 'Preview and generate OG images for your pages',
    status: 'Planning',
    releaseDate: 'Q3 2024',
  },
  {
    title: 'Code Snippet Manager',
    description: 'Organize and share code snippets',
    status: 'In Progress',
    releaseDate: 'Q2 2024',
  },
]

// Tech stack items
const techStack = [
  { name: 'Next.js 15', icon: '⚡' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'TailwindCSS', icon: '🎨' },
  { name: 'PostgreSQL', icon: '🗄️' },
  { name: 'OpenAI', icon: '🤖' },
  { name: 'Vercel', icon: '▲' },
  { name: 'Prisma', icon: '📊' },
  { name: 'Framer Motion', icon: '✨' },
]

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full section-py overflow-hidden">
        <div className="container-lg mx-auto section-px">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Welcome to Indie Tools
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
              Free Tools Built with{' '}
              <span className="gradient-text">Purpose</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A collection of powerful, free online utilities and AI-powered tools.
              Designed for developers, designers, and creators. No paywalls. No
              tracking.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="/tools"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                <span>Explore Tools</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center space-x-2 px-6 py-3 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Read Blog</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="section-py border-t border-slate-200 dark:border-slate-800">
        <div className="container-lg mx-auto section-px">
          <div className="space-y-12">
            {/* Section header */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Featured Tools
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Start with these popular tools to boost your productivity
              </p>
            </div>

            {/* Tools grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group card-hover p-6"
                >
                  <div className="space-y-4">
                    {/* Icon and category */}
                    <div className="flex items-start justify-between">
                      <div className="text-4xl">{tool.icon}</div>
                      <span className="text-xs font-semibold uppercase px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                        {tool.category}
                      </span>
                    </div>

                    {/* Title and description */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {tool.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="pt-4">
                      <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors translate-x-0 group-hover:translate-x-1 duration-200" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View all tools button */}
            <div className="text-center pt-8">
              <Link
                href="/tools"
                className="inline-flex items-center space-x-2 text-slate-900 dark:text-white font-semibold hover:space-x-4 transition-all duration-200"
              >
                <span>View all {featuredTools.length + 5} tools</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Currently Building Section */}
      <section className="section-py border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="container-lg mx-auto section-px">
          <div className="space-y-12">
            {/* Section header */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  In Development
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Currently Building
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Here's what I'm working on next
              </p>
            </div>

            {/* Building items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentlyBuilding.map((item, idx) => (
                <div key={idx} className="card p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-medium">
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.releaseDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section-py border-t border-slate-200 dark:border-slate-800">
        <div className="container-lg mx-auto section-px">
          <div className="space-y-12">
            {/* Section header */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Built With
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Powered by modern, open-source technologies
              </p>
            </div>

            {/* Tech stack grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="card p-4 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="text-3xl">{tech.icon}</div>
                  <p className="text-xs font-medium text-center text-slate-700 dark:text-slate-300">
                    {tech.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-py border-t border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950">
        <div className="container-md mx-auto section-px">
          <div className="space-y-8 text-center">
            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Get Updates on New Tools
              </h2>
              <p className="text-lg text-slate-400">
                Join {' '} 
                <span className="font-semibold">2,000+</span>
                {' '} developers getting updates on new tools and features
              </p>
            </div>

            {/* Email form */}
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            {/* Privacy note */}
            <p className="text-sm text-slate-500">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-py border-t border-slate-200 dark:border-slate-800">
        <div className="container-md mx-auto section-px">
          <div className="space-y-12">
            {/* Section header */}
            <div className="space-y-4 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            {/* FAQ items */}
            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                {
                  q: 'Are these tools really free?',
                  a: 'Yes! All tools are completely free. No premium tiers, no paywalls. Support the project through donations if you find value.',
                },
                {
                  q: 'Do you track my data?',
                  a: 'No. We use privacy-focused analytics only. Your data stays yours. Check our privacy policy for details.',
                },
                {
                  q: 'Can I use these tools for commercial work?',
                  a: 'Absolutely. All tools are available for personal and commercial use.',
                },
                {
                  q: 'Is the source code available?',
                  a: 'Yes! The entire platform is open source on GitHub. Feel free to fork, modify, or self-host.',
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group card p-6 cursor-pointer hover:shadow-md transition-all duration-200"
                >
                  <summary className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                    <span>{faq.q}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
