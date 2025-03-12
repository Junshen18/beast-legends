"use client";
import { useEffect, useState } from "react";
import WalletButton from "../WalletButton";
import data from "../../data/landing-page.json";
import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
  const [isOverWhiteSection, setIsOverWhiteSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get all sections with white background
      const whiteSections = document.querySelectorAll('.bg-white');
      const nav = document.querySelector('nav');
      
      if (!nav) return;
      
      const navRect = nav.getBoundingClientRect();
      
      // Check if navigation overlaps with any white section
      let overlapsWhite = false;
      whiteSections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();
        if (navRect.top >= sectionRect.top && navRect.top <= sectionRect.bottom) {
          overlapsWhite = true;
        }
      });
      
      setIsOverWhiteSection(overlapsWhite);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed w-full bg-transparent z-50 font-dark-mystic">
      <div className="mx-auto px-12 h-18 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/white-title.svg"
            alt="Beast Legends Logo"
            width={190}
            height={168}
            className={`${isOverWhiteSection ? 'invert' : ''}`}
          />
        </Link>
        <div className={`flex items-center gap-8 text-2xl ${isOverWhiteSection ? 'text-black' : 'text-white'}`}>
          {data.navigation.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div>
          <WalletButton isOverWhiteSection={isOverWhiteSection} />
        </div>
      </div>
    </nav>
  );
} 