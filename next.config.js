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
      { source: '/market.html', destination: '/market', permanent: false },
      { source: '/%E9%BB%84%E9%87%91%E5%B8%82%E5%9C%BA%E6%96%B0%E9%97%BB', destination: '/news', permanent: true }
    ]
  }
}

module.exports = nextConfig