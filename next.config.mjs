/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out', // Изрично казваме на Next да сложи всичко в папка "out"
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
