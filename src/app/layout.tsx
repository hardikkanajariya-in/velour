import type { Metadata } from "next";
import { headingFont, bodyFont, monoFont } from "@/lib/fonts";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VELOUR – Wear the Story",
    template: "%s | VELOUR",
  },
  description: "Premium fashion for the modern Indian wardrobe. Discover curated clothing, accessories and more at VELOUR.",
  keywords: ["fashion", "clothing", "online shopping", "India", "premium fashion", "VELOUR"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "VELOUR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} font-body antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "!font-body !text-sm",
              duration: 3000,
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
