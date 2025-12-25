import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatAssistant from "@/components/ChatAssistant";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
        {/* Main App - Full Width */}
        <main className="w-full min-h-screen overflow-y-auto">
          {children}
        </main>

        {/* Global Controls */}
        <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Global Chat Assistant (BONUS 1) */}
        <ChatAssistant />
      </body>
    </html>
  );
}
