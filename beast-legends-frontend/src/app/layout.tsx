import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Inter } from "next/font/google";

import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const darkMystic = localFont({
  src: './fonts/darkmystic.otf',
  variable: '--font-dark-mystic',
})


export const metadata: Metadata = {
  title: "Mystic Kaizer",
  description: "Mystic Kaizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${darkMystic.variable} antialiased font-sans`}
      >
        <AppWalletProvider>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
