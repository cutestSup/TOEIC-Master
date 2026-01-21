import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "TOEIC Master Sprint",
  description: "3-Month Plan to 800+ TOEIC Score - Master TOEIC with interactive lessons, vocabulary flashcards, and progress tracking",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/game-logo.png",
    apple: "/images/game-logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TOEIC Sprint",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <div className="p-6 md:p-8 h-full w-full max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
