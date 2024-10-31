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
      <body className={`${geistSans.variable} ${geistMono.variable} h-screen flex flex-col divide-y divide-slate-300 overflow-auto`}>
        <div className="flex flex-row grow h-auto bg-gradient-to-br from-green-200 via-white to-green-100">
            <SideNav />           
          <main className="h-full md:overflow-auto">{children}</main>
        </div>
        <div className="flex-none h-14">
          <Footer  />      
        </div>
      </body>
    </html>
  );
}

