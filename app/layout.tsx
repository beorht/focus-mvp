import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LogConsole from "@/components/LogConsole";
import ChatAssistant from "@/components/ChatAssistant";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "F.O.C.U.S - AI Career Navigator",
  description: "AI-powered career guidance platform for Uzbekistan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex min-h-screen">
          {/* Main App (65-70%) */}
          <main className="w-full md:w-[65%] overflow-y-auto">
            {children}
          </main>

          {/* AI Terminal (30-35%) - Hidden on mobile */}
          <LogConsole />
        </div>

        {/* Global Theme Toggle */}
        <ThemeToggle />

        {/* Global Chat Assistant (BONUS 1) */}
        <ChatAssistant />
      </body>
    </html>
  );
}
