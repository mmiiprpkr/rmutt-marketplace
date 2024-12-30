import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
   ...withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
   }),
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "sincere-eagle-142.convex.cloud",
         },
         {
            protocol: "https",
            hostname: "media4.giphy.com",
         },
         {
            protocol: "https",
            hostname: "media3.giphy.com",
         },
         {
            protocol: "https",
            hostname: "media0.giphy.com",
         },
         {
            protocol: "https",
            hostname: "media1.giphy.com",
         },
         {
            protocol: "https",
            hostname: "media2.giphy.com",
         },
         {
            protocol: "https",
            hostname: "kindly-wolf-784.convex.cloud",
         }
      ],
   },
};

export default nextConfig;
