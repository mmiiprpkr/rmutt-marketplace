import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
   ...withPWA({
      dest: 'public',
      register: true,
      skipWaiting: true,
   }),
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "sincere-eagle-142.convex.cloud",
         },
      ],
   },
};

export default nextConfig;
