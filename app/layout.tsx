import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SideNav from '@/app/ui/sidenav';
import Footer from "./ui/footer";
import { Toaster } from "@/app/ui/toaster";

const geistSans = localFont({
  src: "../lib/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../lib/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Finance Guy",
  description: "Finance Guy ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} h-screen flex overflow-hidden`}>
        <div className="flex flex-1">
          <SideNav />           
          <div className="flex-1 flex flex-col overflow-auto">
            <main className="flex-1">
              {children}
            </main>
            <Footer className="flex-shrink-0" />
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

