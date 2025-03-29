"use client";
import { Reveal } from "../reveal";
import Image from "next/image";
import data from "../../data/landing-page.json";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Collections() {
  const images = [
    { src: "/marketplace/mythic-2.png", alt: "mythic-2" },
    { src: "/marketplace/rare-2.png", alt: "rare-2" },
    { src: "/marketplace/common-2.png", alt: "common-2" },
    { src: "/marketplace/mythic.png", alt: "mythic" },
    { src: "/marketplace/rare.png", alt: "rare" },
    { src: "/marketplace/common.png", alt: "common" },
  ];

  const [currentIndex, setCurrentIndex] = useState(1); // Start with the middle image
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the transition duration
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with the transition duration
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [isTransitioning]);

  // Create an expanded array for smoother transitions
  const getVisibleImages = () => {
    return [
      images[(currentIndex - 1 + images.length) % images.length],
      images[currentIndex],
      images[(currentIndex + 1) % images.length]
    ];
  };

  return (
    <section className="py-20 px-6 bg-[url('/landing-page/collections.png')] bg-cover bg-center">
      <div className="mx-auto flex flex-col gap-10 justify-center items-center h-[870px]">
        <Reveal>
          <div className="text-6xl w-full text-center">
            {data.collections.title}
          </div>
        </Reveal>
        <div className="flex flex-row items-center">
          <Image
            src="/landing-page/diamond-right.svg"
            alt="line"
            width={10}
            height={10}
          />
          <hr className="lg:w-[200px] xl:w-[500px] h-[1.5px] bg-white" />
          <Image
            src="/landing-page/diamond-left.svg"
            alt="line"
            width={10}
            height={10}
          />
        </div>
        
        <div className="relative w-full max-w-[1400px] flex justify-center items-center">
          {/* Left arrow */}
          <button 
            onClick={prevSlide} 
            className="absolute left-4 z-20 bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
            disabled={isTransitioning}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Carousel */}
          <div className="flex flex-row items-center gap-6 overflow-hidden">
            {getVisibleImages().map((image, index) => {
              // Determine if this is the center image
              const isCenter = index === 1;
              
              return (
                <div 
                  key={`${image.src}-${index}`}
                  className={`transition-all duration-500 ease-in-out transform ${
                    isCenter ? 'scale-100 z-10' : 'scale-90 brightness-50'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={isCenter ? 500 : 400}
                    height={isCenter ? 500 : 400}
                    className="transition-all duration-500 ease-in-out"
                    priority={isCenter}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Right arrow */}
          <button 
            onClick={nextSlide} 
            className="absolute right-4 z-20 bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
            disabled={isTransitioning}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Indicator dots */}
        <div className="flex space-x-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <Link href="/mint" className="text-white text-2xl font-bold" >Mint Now</Link>
      </div>

    </section>
  );
} 