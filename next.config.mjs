/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Remotion renderer from server bundle — FFmpeg binaries fail on Vercel
  experimental: {
    serverExternalPackages: ['@remotion/renderer'],
  },
  // Ensure images from MinIO work
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.1.2',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
