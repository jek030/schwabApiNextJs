import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SideNav from '@/app/ui/sidenav';
import Footer from "./ui/footer";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-green-100">
        <div className="w-full flex-none md:w-64">
          <SideNav />
          
        </div>
        <div className="flex min-h-screen w-full flex-col items-center justify-center py-32">{children}</div>
       
      </div>
      <Footer/>
      </body>
    </html>
  );
}

