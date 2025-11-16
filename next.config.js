/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
  async redirects() {
    return [
      { source: '/multi-calculator', destination: '/calculator', permanent: false },
      { source: '/batch-calculator', destination: '/calculator', permanent: false },
      { source: '/index.html', destination: '/', permanent: false },
      { source: '/:slug.html', destination: '/:slug', permanent: false },
      { source: '/calculator.html', destination: '/calculator', permanent: false },
      { source: '/metals.html', destination: '/metals', permanent: false },
      { source: '/market.html', destination: '/market', permanent: false }
    ]
  }
}

module.exports = nextConfig