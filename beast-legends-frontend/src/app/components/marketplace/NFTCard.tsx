"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Listing as MetaplexListing, LazyListing } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from '@solana/wallet-adapter-react';
import ListingModal from "./ListingModal";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
  attributes: Record<string, string>;
  listing: MetaplexListing | LazyListing;
  onList: () => void;
  onBuy: () => Promise<void>;
  onCancelListing: () => Promise<void>;
}

const NFTCard: React.FC<NFTCardProps> = ({
  id,
  name,
  image,
  price,
  rarity,
  attributes,
  listing,
  onList,
  onBuy,
  onCancelListing
}) => {
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const wallet = useWallet();

  const handleBuy = async () => {
    try {
      setIsLoading(true);
      await onBuy();
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert("Failed to buy NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelListing = async () => {
    try {
      setIsCancelling(true);
      await onCancelListing();
    } catch (error) {
      console.error("Error cancelling listing:", error);
      alert("Failed to cancel listing. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleListingSuccess = () => {
    setIsListingModalOpen(false);
    onList();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "text-yellow-500";
      case "epic":
        return "text-purple-500";
      case "rare":
        return "text-blue-500";
      case "uncommon":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  // Check if the current user is the seller
  const isSeller = wallet.connected && wallet.publicKey && 
    (listing as any).sellerAddress?.toString() === wallet.publicKey.toString();

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-full w-full">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
        <div className={`text-sm font-medium mb-2 ${getRarityColor(rarity)}`}>
          {rarity}
        </div>
        <div className="text-white mb-4">
          <span className="font-medium">Price:</span> {price} SOL
        </div>
        <div className="flex justify-center gap-2">
          {isSeller ? (
            <button
              onClick={handleCancelListing}
              disabled={isCancelling}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? "Cancelling..." : "Cancel Listing"}
            </button>
          ) : (
            <button
              onClick={handleBuy}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Buying..." : "Buy"}
            </button>
          )}
        </div>
      </div>

      <ListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        nft={{
          mintAddress: id,
          name,
          image
        }}
        onSuccess={handleListingSuccess}
      />
    </div>
  );
};

export default NFTCard;