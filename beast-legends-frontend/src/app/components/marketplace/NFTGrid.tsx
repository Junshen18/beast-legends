"use client";
import React from "react";
import GridListView from "../ui/GridListView";
import NFTCard from "./NFTCard";

interface NFTGridProps {
  items: any[];
  filters: {
    priceRange: { min: number; max: number };
    rarity: string[];
    attributes: Record<string, string>;
    sortBy: string;
  };
  loading: boolean;
  wallet: any;
  onListNFT: (nft: { mintAddress: string; name: string; image: string; }) => void;
}

const NFTGrid: React.FC<NFTGridProps> = ({ items, filters, loading, wallet, onListNFT }) => {
  // Apply filters to NFTs
  const filteredNFTs = items.filter((nft) => {
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
      !filters.rarity.includes(nft.rarity || "Common")
    ) {
      return false;
    }

    // Attribute filters
    for (const [key, values] of Object.entries(filters.attributes)) {
      if (values.length > 0 && !values.includes(nft.attributes[key])) {
        return false;
      }
    }

    return true;
  });

  // Sort NFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low_to_high":
        return a.price - b.price;
      case "price_high_to_low":
        return b.price - a.price;
      case "recent":
        return new Date(b.listing?.createdAt || 0).getTime() - new Date(a.listing?.createdAt || 0).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="text-white">Loading NFTs...</div>;
  }

  return (
    <div className="flex-1">
      <GridListView
        data={sortedNFTs.map(nft => ({
          ...nft,
          id: String(nft.id || nft.address || nft.mint), // Ensure id is always a string
          rarity: nft.rarity || "Common" // Ensure rarity has a default value
        }))}
        columns={4}
        cardWidth={300}
        renderCard={(nft) => (
          <NFTCard 
            key={nft.id}
            id={String(nft.id)}
            name={nft.name}
            image={nft.image}
            price={nft.price}
            rarity={nft.rarity || "Common"}
            attributes={nft.attributes}
            listing={nft.listing}
            onList={() => onListNFT({
              mintAddress: nft.mintAddress || nft.mint,  // Use mintAddress if available, fallback to mint
              name: nft.name,
              image: nft.image
            })}
          />
        )}
        className="text-white"
      />
    </div>
  );
};

export default NFTGrid;