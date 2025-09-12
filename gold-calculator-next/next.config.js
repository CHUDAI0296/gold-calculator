/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用图片优化
  images: {
    domains: ['api.metals.live'], // 允许从metals.live加载图片
    formats: ['image/avif', 'image/webp'], // 启用现代图片格式
  },

  // 启用压缩
  compress: true,

  // 生产环境优化
  productionBrowserSourceMaps: false, // 禁用生产环境的源码映射

  // 静态资源优化

  // 实验性功能
  experimental: {
    optimizeCss: true, // CSS优化
  },

  // 缓存优化
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 页面缓存时间
    pagesBufferLength: 5, // 同时缓存的页面数
  },

  // HTTP响应头配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
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
        ],
      },
    ];
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;