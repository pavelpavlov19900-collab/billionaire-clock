/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  // ТОВА Е КРИТИЧНО ЗА GITHUB PAGES:
  basePath: '/billionaire-clock', 
  assetPrefix: '/billionaire-clock',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
