// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/Providers";
import AuthButtons from "@/components/auth/AuthButtons";
import Link from "next/link"; // Import Link for your logo/home link
import { Home } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Промковш",
  description: "Промковш",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <header className="fixed top-0 left-0 w-full bg-white bg-opacity-95 backdrop-blur-sm z-50 shadow-sm py-3 px-2 sm:px-24 md:px-36 lg:px-56 flex items-center justify-between">
            {/* Logo or Site Title - positioned to the left */}
            <Link
              href="/"
              className="flex items-center gap-2 group" // Added group class for hover effect
            >
              <Home className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />{" "}
              {/* More prominent, colored icon */}
              <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                Главная
              </span>
            </Link>

            {/* AuthButtons - positioned to the right */}
            <AuthButtons />
          </header>

          {/* Main content with padding to prevent overlap with fixed header */}
          <main className="pt-20 pb-4 lg:pb-6 px-2 sm:px-24 md:px-36 lg:px-56">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}
