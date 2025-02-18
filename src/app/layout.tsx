import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/providers/theme-provider";
import FCMNotificationProvider from "@/components/providers/fcm-nofi-provider";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
   width: "device-width",
   initialScale: 1,
   maximumScale: 1,
   userScalable: false,
   interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
   title: "Rmutt Marketplace",
   description: "Rmutt Marketplace",
   manifest: "/manifest.json",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <ConvexAuthNextjsServerProvider>
         <html lang="en">
            <body className={inter.className}>
               <ConvexClientProvider>
                  <FCMNotificationProvider>
                     <NuqsAdapter>
                        <Toaster position="top-right" expand />
                        <ThemeProvider
                           attribute="class"
                           defaultTheme="system"
                           enableSystem
                           disableTransitionOnChange
                        >
                           {children}
                        </ThemeProvider>
                     </NuqsAdapter>
                  </FCMNotificationProvider>
               </ConvexClientProvider>
            </body>
         </html>
      </ConvexAuthNextjsServerProvider>
   );
}
