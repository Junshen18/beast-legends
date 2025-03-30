"use client";
import { useEffect, useState } from "react";
import WalletButton from "../WalletButton";
import data from "../../data/landing-page.json";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [isOverWhiteSection, setIsOverWhiteSection] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [previousConnectionState, setPreviousConnectionState] = useState(false);

  // Track wallet connection changes and redirect to dapp when connected
  useEffect(() => {
    // Only redirect if the user just connected (was disconnected before)
    // if (connected && !previousConnectionState) {
    //   router.push('/dapp');
    // }
    
    // Update the previous connection state
    setPreviousConnectionState(connected);
  }, [connected, previousConnectionState, router]);

  useEffect(() => {
    const handleScroll = () => {
      // Get all sections with white background
      const whiteSections = document.querySelectorAll(".bg-white");
      const nav = document.querySelector("nav");

      if (!nav) return;

      const navRect = nav.getBoundingClientRect();

      // Check if navigation overlaps with any white section
      let overlapsWhite = false;
      whiteSections.forEach((section) => {
        const sectionRect = section.getBoundingClientRect();
        if (
          navRect.top >= sectionRect.top &&
          navRect.top <= sectionRect.bottom
        ) {
          overlapsWhite = true;
        }
      });

      setIsOverWhiteSection(overlapsWhite);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerButton = document.getElementById('hamburger-button');
      
      if (mobileMenu && hamburgerButton && 
          !mobileMenu.contains(event.target as Node) && 
          !hamburgerButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define a consistent width for all navigation items
  const navItemClass = "w-40 text-center flex justify-center items-center";

  const renderNavLink = (link: any) => {
    if (link.label === "Launch") {
      return connected ? (
        <Link href="/dapp" key={link.label} className="flex flex-row items-center gap-2 hover:scale-105 transition-all duration-300">
          <Image
            src="/landing-page/launch-left.png"
            alt="launch left"
            width={80}
            height={50}
          />
          <div className="py-3 text-3xl">
            {link.label}
          </div>
          <Image
            src="/landing-page/launch-right.png"
            alt="launch right"
            width={80}
            height={50}
          />
        </Link>
      ) : (
        <div 
          key={link.label} 
          className="flex flex-row items-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => {
            const walletButton = document.querySelector('.wallet-adapter-button');
            if (walletButton) {
              (walletButton as HTMLElement).click();
            }
          }}
        >
          <Image
            src="/landing-page/launch-left.png"
            alt="launch left"
            width={80}
            height={50}
          />
          <div className="py-3 text-3xl">
            Launch App
          </div>
          <Image
            src="/landing-page/launch-right.png"
            alt="launch right"
            width={80}
            height={50}
          />
        </div>
      );
    }

    return (
      <div key={link.label} className={`group ${navItemClass}`}>
        <a
          href={link.href}
          className={`pointer-events-auto cursor-pointer px-4 py-2 z-[100] flex items-center justify-center rounded-md w-full ${
            isOverWhiteSection
              ? "text-black group-hover:bg-black/10 group-hover:backdrop-blur-md"
              : "text-white group-hover:bg-black/20 group-hover:backdrop-blur-md"
          }`}
        >
          {link.label}
        </a>
      </div>
    );
  };

  return (
    <nav className="fixed w-full bg-transparent z-50 font-dark-mystic">
      <div className="mx-auto px-4 sm:px-12 h-24 flex items-center justify-center md:justify-between">
        <Link href="/">
          <Image
            src="/white-title.svg"
            alt="Beast Legends Logo"
            width={190}
            height={168}
            className={`md:${isOverWhiteSection ? "invert" : ""}`}
          />
        </Link>
        <div className={`hidden md:flex flex-row items-center text-2xl ${isOverWhiteSection ? "text-black" : "text-white"}`}>
            {data.navigation.links.map(renderNavLink)}
          </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center text-2xl">
            <WalletButton isOverWhiteSection={isOverWhiteSection} />
        </div>

        {/* Mobile Menu Button */}
        <button
          id="hamburger-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="absolute right-4 md:hidden p-2 rounded-lg hover:bg-black/20 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke={isOverWhiteSection ? "currentColor" : "white"}
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-black/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {data.navigation.links.map((link) => (
            <div
              key={link.label}
              className="text-2xl text-white hover:text-gray-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {renderNavLink(link)}
            </div>
          ))}
          <div className="mt-4">
            <WalletButton isOverWhiteSection={false} />
          </div>
        </div>
      </div>
    </nav>
  );
}
