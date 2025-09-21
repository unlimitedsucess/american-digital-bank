import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import ClientProvider from "@/store/client-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "American Horizon - Your Trusted Financial Partner",
  description:
    "Experience modern banking with American Horizon. Secure, innovative, and customer-focused financial services.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/americanh-logo.svg", type: "image/svg+xml" },
      { url: "/americanh-logo-32.png", type: "image/png", sizes: "32x32" },
      { url: "/americanh-logo-192.png", type: "image/png", sizes: "192x192" },
      { url: "/americanh-logo-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: {
      url: "/americanh-logo-180.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientProvider>
          <Suspense fallback={null}>
            <Toaster richColors position="top-right" />
            {children}
          </Suspense>
          <Analytics />
        </ClientProvider>
      </body>
    </html>
  );
}
