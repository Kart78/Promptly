// next.config.js
/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require('remark-gfm'),
      require('remark-frontmatter'),
    ],
    rehypePlugins: [],
  },
})

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // Image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/tools/:path*',
        destination: '/tools/:path*',
        permanent: true,
      },
    ]
  },

  // Rewrite for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },

  // Compression and optimization
  compress: true,
  // swcMinify removed - built into Next.js 15 by default
  productionBrowserSourceMaps: false,

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Indie Tools',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Experimental features
  experimental: {
    // ppr removed - requires Next.js canary, not stable 15.x
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'react-icons',
    ],
    // streamingMinimumChunkSize removed - not a valid Next.js 15 option
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    config.optimization.splitChunks.cacheGroups = {
      ...config.optimization.splitChunks.cacheGroups,
      reactVendor: {
        test: /[\\/]node_modules[\\/](react|react-dom|react-hook-form)[\\/]/,
        name: 'react-vendor',
        priority: 10,
        reuseExistingChunk: true,
      },
      uiVendor: {
        test: /[\\/]node_modules[\\/](lucide-react|clsx|tailwind-merge)[\\/]/,
        name: 'ui-vendor',
        priority: 9,
        reuseExistingChunk: true,
      },
    }
    return config
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Typescript
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // ESLint
  eslint: {
    dirs: ['app', 'components', 'lib', 'types'],
  },
}

module.exports = withMDX(nextConfig)
