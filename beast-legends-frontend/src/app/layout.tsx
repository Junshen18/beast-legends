import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Inter } from "next/font/google";

import "./globals.css";
import ClientWalletProvider from "./components/WalletProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const darkMystic = localFont({
  src: './fonts/darkmystic.otf',
  variable: '--font-dark-mystic',
})


export const metadata: Metadata = {
  title: "Beast Legends",
  description: "Beast Legends",
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
        <ClientWalletProvider>
          {children}
        </ClientWalletProvider>
      </body>
    </html>
  );
}
