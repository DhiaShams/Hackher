import type { Metadata, Viewport } from "next";
import { Outfit, Lexend } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-dyslexic",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "EmpowRead",
  description: "Empowering young readers with AI and AR",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${lexend.variable} antialiased min-h-screen pb-20 md:pb-0`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="pt-20 px-4 max-w-7xl mx-auto">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
