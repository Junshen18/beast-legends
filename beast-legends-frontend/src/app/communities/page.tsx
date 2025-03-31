"use client";

import React from "react";
import Navigation from "../components/landing-page/Navigation";
import Image from "next/image";
import Link from "next/link";

// Dummy data for communities
const communities = [
  {
    id: 1,
    name: "Dragon Masters",
    members: 182,
    image: "/communities/c4.jpg",
    description: "A community of legendary dragon tamers and collectors.",
    isActive: true
  },
  {
    id: 2,
    name: "Beast Hunters",
    members: 92,
    image: "/communities/c3.jpg",
    description: "Elite hunters seeking the rarest beasts in the realm.",
    isActive: true
  },
  {
    id: 3,
    name: "Mythic Council",
    members: 0,
    image: "/communities/c1.jpg",
    description: "The governing body of Beast Legends. Coming Soon.",
    isActive: false
  },
  {
    id: 4,
    name: "Elements Guild",
    members: 0,
    image: "/communities/c2.jpg",
    description: "Masters of elemental beasts. Coming Soon.",
    isActive: false
  }
];

export default function CommunitiesPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        <Image
          src="/marketplace/marketplace-bg.png"
          alt="Communities Banner"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black">
          <div className="container mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-dark-mystic">
              Communities
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Join forces with fellow Beast Legend players, share strategies, and build lasting friendships in our thriving communities.
            </p>
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.map((community) => (
            <div
              key={community.id}
              className="relative group rounded-2xl overflow-hidden bg-zinc-900 hover:bg-zinc-800 transition-all duration-300"
            >
              <div className="relative">
                <Image
                  src={community.image}
                  alt={community.name}
                  width={600}
                  height={600}
                  className="object-cover aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white font-dark-mystic">
                    {community.name}
                  </h3>
                  {community.isActive ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                      {community.members} members
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 mb-6">
                  {community.description}
                </p>
                
                {community.isActive ? (
                  <Link
                    href={`/communities/${community.id}`}
                    className="inline-block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    Join Community
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-700 px-6 py-3 rounded-lg font-bold text-gray-400 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-16 relative rounded-2xl overflow-hidden">
          <div className="relative h-[200px]">
            <Image
              src="/dapp/game-home-bg2.png"
              alt="More Communities Coming Soon"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm">
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-dark-mystic">
                  More Communities Coming Soon
                </h2>
                <p className="text-gray-300 max-w-2xl">
                  Stay tuned for more exciting communities! Join our Discord to suggest new community ideas and be the first to know when they launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
