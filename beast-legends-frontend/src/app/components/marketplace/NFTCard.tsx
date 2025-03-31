"use client";
import { useState } from "react";
import Image from "next/image";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from '@solana/wallet-adapter-react';
import ListingModal from "./ListingModal";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity?: string;
  attributes: Record<string, string>;
  listing?: any;
  onList: () => void;
}

export default function NFTCard({ id, name, image, price, rarity = "Common", attributes, listing, onList }: NFTCardProps) {
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const wallet = useWallet();

  const handleBuy = async () => {
    if (!wallet.connected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      // Implement buy functionality here
      alert("Buy functionality coming soon!");
    } catch (error) {
      console.error('Error buying NFT:', error);
      alert("Failed to buy NFT. Please try again.");
    }
  };

  const handleListingSuccess = () => {
    setIsListingModalOpen(false);
    onList();
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className={`text-lg font-semibold mb-2 ${getRarityColor(rarity)}`}>
          {rarity}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-white">Price: {price} SOL</p>
          {wallet.connected && wallet.publicKey?.toString() === listing?.seller?.toString() ? (
            <button
              onClick={() => setIsListingModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              List
            </button>
          ) : (
            <button
              onClick={handleBuy}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Buy
            </button>
          )}
        </div>
      </div>

      <ListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        nft={{
          mint: id,
          name,
          image
        }}
        onSuccess={handleListingSuccess}
      />
    </div>
  );
}

function getRarityColor(rarity: string = "Common"): string {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'text-gray-400';
    case 'rare':
      return 'text-blue-400';
    case 'epic':
      return 'text-purple-400';
    case 'mythic':
      return 'text-yellow-400';
    default:
      return 'text-white';
  }
}