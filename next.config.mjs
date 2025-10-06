// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- THIS IS THE CRITICAL PART THAT WAS MISSING ---
  // Restoring the rewrites function to proxy API calls to your Flask backend.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
    ]
  },
  // ----------------------------------------------------
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '4.240.96.183', // For your uploaded images
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // For the old Spotify placeholder
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // For our fallback placeholder
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com', // For the new iTunes API images
      },
    ],
  },
};

export default nextConfig;
