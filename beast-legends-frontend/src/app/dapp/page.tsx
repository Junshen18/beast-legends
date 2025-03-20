"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";

export default function Dapp() {
  const { publicKey, connected } = useWallet();
  const [selectedTab, setSelectedTab] = useState("home");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check if wallet is connected and redirect if not
  useEffect(() => {
    // Short delay to ensure wallet state is properly loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!connected) {
        router.push('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [connected, router]);

  // Mock data for the user's beasts/NFTs
  const userBeasts = [
    {
      id: 1,
      name: "Fire Dragon",
      image: "/marketplace/mythic-2-square.png",
      level: 51,
      maxLevel: 100,
      element: "fire",
      rarity: "mythic"
    }
  ];

  // Mock data for activities
  const activities = [
    {
      id: "story",
      title: "Story Mode",
      subtitle: "CHAPTER I: ORIGINS",
      image: "/dapp/story-mode.png",
      color: "bg-amber-700"
    },
    {
      id: "battle",
      title: "Battle",
      subtitle: "PVP Arena",
      image: "/dapp/battle-mode.png",
      color: "bg-blue-700"
    },
    {
      id: "quest",
      title: "Quests",
      subtitle: "DAILY MISSIONS",
      image: "/dapp/quest-mode.png",
      color: "bg-purple-700"
    }
  ];

  // Show loading state while checking wallet connection
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[url('/dapp/game-home-bg2.png')] bg-cover bg-right flex items-center justify-center">
        <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl text-white text-center">
          <div className="animate-spin mb-4 mx-auto w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
          <h2 className="text-2xl font-bold font-dark-mystic">Loading Beast Legends...</h2>
          <p className="mt-2 text-gray-300">Checking wallet connection</p>
        </div>
      </div>
    );
  }

  // Show connect wallet prompt if not connected (this is a fallback, as useEffect should redirect)
  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen w-full bg-[url('/dapp/game-home-bg2.png')] bg-cover bg-right flex items-center justify-center">
        <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl text-white text-center max-w-md">
          <Image 
            src="/white-title.svg"
            alt="Beast Legends Logo"
            width={200}
            height={60}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold font-dark-mystic mb-4">Connect Your Wallet</h2>
          <p className="mb-6">You need to connect your wallet to access the Beast Legends dapp.</p>
          <div className="flex justify-center mb-6">
            <WalletMultiButton />
          </div>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Return to Home Page
          </Link>
        </div>
      </div>
    );
  }

  // Main dapp content - only shown to connected users
  return (
    <div className="min-h-screen w-full bg-[url('/dapp/game-home-bg2.png')] bg-cover bg-right text-white">
      {/* Top Navigation Bar */}
      <div className="w-full h-20 bg-black/40 backdrop-blur-sm flex items-center justify-between px-8">
        <Link href="/">
          <Image
            src="/white-title.svg"
            alt="Beast Legends Logo"
            width={150}
            height={40}
            className="cursor-pointer"
          />
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Currency displays */}
          {/* <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
            <Image 
              src="/dapp/coin-icon.png" 
              alt="Coins" 
              width={24} 
              height={24} 
            />
            <span className="text-yellow-400 font-bold">51251</span>
          </div>
          
          <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
            <Image 
              src="/dapp/gem-icon.png" 
              alt="Gems" 
              width={24} 
              height={24} 
            />
            <span className="text-blue-400 font-bold">1024</span>
          </div> */}
          
          {/* Wallet Button */}
          <div className="ml-4">
            <WalletMultiButton />
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-5rem)] p-6">
        {/* Left Sidebar - Character Info */}
        <div className="w-1/4 bg-black/40 backdrop-blur-sm rounded-xl p-4 flex flex-col">
          {/* Character Profile */}
          <div className="flex items-center gap-4 border-b border-gray-600 pb-4">
            <div className="relative">
              <Image 
                src="/profile.png" 
                alt="Player Avatar" 
                width={80} 
                height={80} 
                className="rounded-full border-2 border-yellow-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                24
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold font-dark-mystic">
                {publicKey.toString().slice(0, 6) + "..."}
              </h2>
              <p className="text-gray-300 text-sm">ID: {publicKey.toString().slice(0, 8)}</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="flex flex-col gap-2 mt-6">
            <button 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedTab === 'home' ? 'bg-purple-800' : 'hover:bg-gray-800'}`}
              onClick={() => setSelectedTab('home')}
            >
              <Image src="/dapp/home-icon.png" alt="Home" width={24} height={24} />
              <span className="font-medium">Home</span>
            </button>
            
            <button 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedTab === 'beasts' ? 'bg-purple-800' : 'hover:bg-gray-800'}`}
              onClick={() => setSelectedTab('beasts')}
            >
              <Image src="/dapp/beast-icon.png" alt="Beasts" width={24} height={24} />
              <span className="font-medium">My Beasts</span>
            </button>
            
            <button 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedTab === 'shop' ? 'bg-purple-800' : 'hover:bg-gray-800'}`}
              onClick={() => setSelectedTab('shop')}
            >
              <Image src="/dapp/shop-icon.png" alt="Shop" width={24} height={24} />
              <span className="font-medium">Marketplace</span>
            </button>
            
            <button 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedTab === 'leaderboard' ? 'bg-purple-800' : 'hover:bg-gray-800'}`}
              onClick={() => setSelectedTab('leaderboard')}
            >
              <Image src="/dapp/leaderboard-icon.png" alt="Leaderboard" width={24} height={24} />
              <span className="font-medium">Leaderboard</span>
            </button>
          </div>
          
          {/* Bottom section */}
          <div className="mt-auto">
            <Link href="/mint" className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg text-center font-bold hover:from-purple-700 hover:to-blue-700 transition-colors">
              Mint New Beast
            </Link>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 ml-6">
          {/* Top Beast Display */}
          <div className="flex gap-6 mb-6">
            {userBeasts.map(beast => (
              <div key={beast.id} className="bg-black/40 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center w-64">
                <div className="relative">
                  <Image 
                    src={beast.image} 
                    alt={beast.name} 
                    width={200} 
                    height={200} 
                    className="rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-yellow-400">
                    {beast.rarity.toUpperCase()}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mt-3">{beast.name}</h3>
                
                <div className="w-full mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level {beast.level}</span>
                    <span>{beast.level}/{beast.maxLevel}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full" 
                      style={{ width: `${(beast.level / beast.maxLevel) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium transition-colors">
                  View Details
                </button>
              </div>
            ))}
            
            {/* Add Beast Card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center w-64 border-2 border-dashed border-gray-600 cursor-pointer hover:bg-black/30 transition-colors">
              <div className="text-5xl mb-2">+</div>
              <p className="text-gray-300">Add Beast</p>
              <Link href="/mint" className="mt-4 text-sm text-blue-400 hover:text-blue-300">
                Mint a new Beast
              </Link>
            </div>
          </div>
          
          {/* Activity Section */}
          <h2 className="text-3xl font-bold mb-4 font-dark-mystic">Activities</h2>
          <div className="grid grid-cols-3 gap-6">
            {activities.map(activity => (
              <div 
                key={activity.id} 
                className={`${activity.color} rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
              >
                <div className="relative h-40">
                  <Image 
                    src={activity.image || "/dapp/placeholder.png"} 
                    alt={activity.title} 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-2xl font-bold font-dark-mystic">{activity.title}</h3>
                    <p className="text-sm text-gray-300">{activity.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Action Buttons */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/60 transition-colors">
              <div>
                <h3 className="text-xl font-bold">DAILY TASKS</h3>
                <p className="text-sm text-gray-300">2/5 Completed</p>
              </div>
              <Image 
                src="/dapp/task-icon.png" 
                alt="Tasks" 
                width={48} 
                height={48} 
              />
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/60 transition-colors">
              <div>
                <h3 className="text-xl font-bold">MARKETPLACE</h3>
                <p className="text-sm text-gray-300">Buy & Sell Beasts</p>
              </div>
              <Image 
                src="/dapp/market-icon.png" 
                alt="Marketplace" 
                width={48} 
                height={48} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}