"use client";
import React from "react";
import GridListView from "../ui/GridListView";
import Image from "next/image";

// Mock NFT data - replace with your actual data fetching logic
const mockNFTs = [
  {
    id: 1,
    name: "Infernal Blaze Dragon #001",
    description: "Inferno Warden - A blazing dragonborn ruler forged in the heart of eternal flames.",
    price: 0.5,
    image: "/marketplace/epic.png",
    rarity: "Epic",
  },
  {
    id: 2,
    name: "Water Lion #042",
    description: "Aqua Roar - The armored lion warrior who commands the tides with ferocious might.",
    price: 0.1,
    image: "/marketplace/common.png",
    rarity: "Common",
  },
  {
    id: 3,
    name: "Vaelorith #103",
    description: "Mystic Warden of the Forest - A celestial guardian infused with ancient magic and ethereal power.",
    price: 1,
    image: "/marketplace/mythic.png",
    rarity: "Mythic",
  },
  {
    id: 4,
    name: "Owlbear #217",
    description: "Stormborne Sentinel - An electrified guardian wielding the fury of the skies.",
    price: 0.25,
    image: "/marketplace/rare.png",
    rarity: "Rare",
  }
];

interface NFTGridProps {
  filters: {
    priceRange: { min: number; max: number };
    rarity: string[];
    attributes: Record<string, string[]>;
    sortBy: string;
  };
}

const NFTGrid: React.FC<NFTGridProps> = ({ filters }) => {
  // Apply filters to NFTs
  const filteredNFTs = mockNFTs.filter((nft) => {
    // Price filter
    if (
      nft.price < filters.priceRange.min ||
      nft.price > filters.priceRange.max
    ) {
      return false;
    }

    // Rarity filter
    if (
      filters.rarity.length > 0 &&
      !filters.rarity.includes(nft.rarity)
    ) {
      return false;
    }

    // Add more filters as needed

    return true;
  });

  // Sort NFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low_to_high":
        return a.price - b.price;
      case "price_high_to_low":
        return b.price - a.price;
      case "name_a_to_z":
        return a.name.localeCompare(b.name);
      case "name_z_to_a":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Custom card renderer for NFTs - adapts based on view mode
  const renderNFTCard = (nft: any, isListView: boolean) => {
    if (isListView) {
      // List view layout
      return (
        <div className="w-full h-full p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <Image
                src={nft.image}
                alt={nft.name}
                width={84}
                height={150}
                className="h-auto object-cover"
              />
            <div>
              <h3 className="text-white text-lg font-semibold">{nft.name}</h3>
              <span className="text-gray-400 text-sm line-clamp-1">{nft.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-cyan-400 font-medium">{nft.price} SOL</div>
            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs px-2 py-1 rounded">
              {nft.rarity}
            </div>
          </div>
        </div>
      );
    } else {
      // Grid view layout - portrait card with auto height
      return (
        <div className="w-full flex flex-col">
          <div className="w-full rounded-md overflow-hidden">
            <Image
              src={nft.image}
              alt={nft.name}
              width={500}
              height={892}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
          <div className="p-4 bg-gray-900">
            <h3 className="text-white text-lg font-semibold">{nft.name}</h3>
            <span className="text-gray-400 text-sm line-clamp-2">{nft.description}</span>
            <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
              <div className="text-cyan-400 font-medium">{nft.price} SOL</div>
              <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs px-2 py-1 rounded">
                {nft.rarity}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex-1">
      <GridListView
        data={sortedNFTs}
        columns={4}
        cardWidth={300}
        renderCard={renderNFTCard}
        className="text-white"
      />
    </div>
  );
};

export default NFTGrid; 