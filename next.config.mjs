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
            hostname: "5vbk7oi3dm.ufs.sh",
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
         },
         {
            protocol: "https",
            hostname: "api.dicebear.com",
         },
         {
            protocol: "https",
            hostname: "utfs.io"
         }
      ],
   },
   async headers() {
      return [
         {
            source: "/api/uploadthing",
            headers: [
               { key: "Access-Control-Allow-Origin", value: "*" },
               { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
               { key: "Access-Control-Allow-Headers", value: "x-uploadthing-version,x-uploadthing-package,Content-Type" },
               { key: "Access-Control-Allow-Credentials", value: "true" }
            ]
         }
      ]
   }
};

export default nextConfig;
