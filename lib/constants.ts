export const APPS = [
  {
    id: '1',
    name: 'Promptly',
    description: 'AI prompt library and manager. Save, organise, and reuse your best prompts across tools.',
    url: 'https://promptly.vercel.app',
    githubUrl: 'https://github.com/Kart78/Promptly',
    tag: 'AI · Web',
    status: 'LIVE',
    featured: true,
    icon: '✨',
  },
  {
    id: '2',
    name: 'PowerBI TDD Generator',
    description: 'Electron desktop app using local Ollama (llama3) to generate Power BI Technical Design Documents from metadata files.',
    url: null,
    githubUrl: 'https://github.com/Kart78/powerbi-tdd-ollama',
    tag: 'AI · Desktop',
    status: 'LIVE',
    featured: true,
    icon: '📊',
  },
  {
    id: '3',
    name: 'Flight Price Tracker',
    description: 'Track how geopolitical events affect airline ticket prices with data-driven insights and visualisations.',
    url: null,
    githubUrl: null,
    tag: 'Aviation · Web',
    status: 'IN_PROGRESS',
    featured: false,
    icon: '✈️',
  },
  {
    id: '4',
    name: 'YouTube SEO Kit',
    description: 'Packaging tools for aviation and travel content — titles, thumbnails, and keyword research automation.',
    url: null,
    githubUrl: null,
    tag: 'YouTube · Tool',
    status: 'IN_PROGRESS',
    featured: false,
    icon: '🎬',
  },
]

export const CATEGORIES = [
  { id: 'general', label: 'General Discussion 💬' },
  { id: 'showcase', label: 'App Showcase 🚀' },
  { id: 'aviation', label: 'Aviation & Travel ✈️' },
  { id: 'ai', label: 'AI & Tools 🤖' },
  { id: 'youtube', label: 'YouTube 📹' },
  { id: 'resources', label: 'Resources 📚' },
]

export const XP_LEVELS = [
  { level: 1, label: 'Newcomer', min: 0 },
  { level: 2, label: 'Explorer', min: 100 },
  { level: 3, label: 'Builder', min: 300 },
  { level: 4, label: 'Creator', min: 700 },
  { level: 5, label: 'Innovator', min: 1500 },
  { level: 6, label: 'Visionary', min: 3000 },
  { level: 7, label: 'Pioneer', min: 5000 },
  { level: 8, label: 'Legend', min: 8000 },
  { level: 9, label: 'AI Grandmaster 🚀', min: 12000 },
]

export function getLevelFromXP(xp: number) {
  return [...XP_LEVELS].reverse().find(l => xp >= l.min) || XP_LEVELS[0]
}
