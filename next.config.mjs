// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      // --- THIS IS THE CRUCIAL PART ---
      // This entry gives Next.js permission to load images directly from your Azure VM.
      {
        protocol: 'http',
        hostname: '4.240.96.183',
      },
      // ------------------------------------
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
      },
    ],
  },
};

export default nextConfig;
