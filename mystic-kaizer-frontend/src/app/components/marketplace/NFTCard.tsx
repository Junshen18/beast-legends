"use client";

import Image from "next/image";

interface NFTCardProps {
  nft: {
    id: string;
    name: string;
    image: string;
    price: number;
    rarity: string;
    attributes: Record<string, string>;
  };
}

export default function NFTCard({ nft }: NFTCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden hover:scale-105 transition-transform">
      <Image
        src={nft.image}
        alt={nft.name}
        width={500}
        height={892}
        className="w-full aspect-square object-cover"
      />
      <div className="p-4">
        <h3 className="text-white text-lg font-semibold">{nft.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-white">{nft.price.toFixed(2)} SOL</span>
          <span className={`text-sm ${getRarityColor(nft.rarity)}`}>
            {nft.rarity}
          </span>
        </div>
        <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          Buy Now
        </button>
      </div>
    </div>
  );
}

function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "Common":
      return "text-gray-400";
    case "Rare":
      return "text-blue-400";
    case "Epic":
      return "text-purple-400";
    case "Mythic":
      return "text-yellow-400";
    default:
      return "text-white";
  }
} 