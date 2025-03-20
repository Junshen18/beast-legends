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

  return (
    <nav className="fixed w-full bg-transparent z-50 font-dark-mystic">
      <div className="mx-auto px-12 h-24 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/white-title.svg"
            alt="Beast Legends Logo"
            width={190}
            height={168}
            className={`${isOverWhiteSection ? "invert" : ""}`}
          />
        </Link>
        <div
          className={`flex items-center gap-8 text-2xl ${
            isOverWhiteSection ? "text-black" : "text-white"
          }`}
        >
          {data.navigation.links.map((link) => {
            // Special handling for "More" to add dropdown
            if (link.label === "Launch App") {
              // If connected, make this a direct link to dapp
              // If not connected, make it trigger the wallet connection
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
            else if (link.label === "More") {
              return (
                <div key={link.label} className="relative group">
                  {/* Main button wrapper with padding to create hoverable area */}
                  <div className="py-3">
                    <div
                      className={`pointer-events-auto cursor-pointer px-4 py-2 z-[100] flex items-center justify-center rounded-md ${
                        isOverWhiteSection
                          ? "text-black group-hover:bg-black/10 group-hover:backdrop-blur-md"
                          : "text-white group-hover:bg-black/20 group-hover:backdrop-blur-md"
                      }`}
                    >
                      {link.label}
                    </div>
                  </div>

                  {/* Dropdown Menu - positioned to remove gap */}
                  <div className="text-base absolute mt-2 right-0 top-[calc(100%-12px)] w-[190px] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                    <div
                      className={`rounded-md overflow-hidden ${
                        isOverWhiteSection ? "bg-white/30" : "bg-black/30"
                      }`}
                    >
                      <Link
                        href="/communities"
                        className={`block w-full text-left px-4 py-2 hover:bg-black/20 transition-colors cursor-pointer ${
                          isOverWhiteSection
                            ? "text-black hover:text-white"
                            : "text-white"
                        }`}
                      >
                        Communities
                      </Link>
                      <Link
                        href="/leaderboard"
                        className={`block w-full text-left px-4 py-2 hover:bg-black/20 transition-colors cursor-pointer ${
                          isOverWhiteSection
                            ? "text-black hover:text-white"
                            : "text-white"
                        }`}
                      >
                        Leaderboard
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            // Regular navigation links
            return (
              <div key={link.label} className="group">
                <a
                  href={link.href}
                  className={`pointer-events-auto cursor-pointer px-4 py-2 z-[100] flex items-center justify-center rounded-md ${
                    isOverWhiteSection
                      ? "text-black group-hover:bg-black/10 group-hover:backdrop-blur-md"
                      : "text-white group-hover:bg-black/20 group-hover:backdrop-blur-md"
                  }`}
                >
                  {link.label}
                </a>
              </div>
            );
          })}
        </div>
        <div>
          <WalletButton isOverWhiteSection={isOverWhiteSection} />
        </div>
      </div>
    </nav>
  );
}
