"use client";

import React, { useState, useEffect } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import axios from "axios";
import Image from "next/image";
import Navigation from "../components/landing-page/Navigation";
import { TypeAnimation } from "react-type-animation";

interface PinataResponse {
  imageUri: string;
  metadataUri: string;
}

interface MintedNFT {
  address: string;
  json: {
    name: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export default function SimpleMintPage() {
  const { publicKey, signTransaction } = useWallet();
  const [minting, setMinting] = useState<boolean>(false);
  const [mintedNFT, setMintedNFT] = useState<MintedNFT | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [metaplex, setMetaplex] = useState<any>(null);

  // Initialize Solana connection and Metaplex
  useEffect(() => {
    const conn = new Connection(clusterApiUrl("devnet"));
    setConnection(conn);

    if (publicKey && signTransaction) {
      const mx = Metaplex.make(conn).use(
        walletAdapterIdentity({ publicKey, signTransaction })
      );
      setMetaplex(mx);
    }
  }, [publicKey, signTransaction]);

  const getImageAndUpload = async (): Promise<PinataResponse> => {
    try {
      // Get fixed image from API
      const response = await axios.post("/api/compose-image", {});

      // Upload to Pinata
      const pinataResponse = await axios.post<PinataResponse>(
        "/api/upload-to-pinata",
        {
          image: response.data.composedImage,
          metadata: {
            name: `Water Lion`,
            description: `Aqua Roar - The armored lion warrior who commands the tides with ferocious might.`,
            attributes: [
              { trait_type: "Type", value: "lion" },
              { trait_type: "Element", value: "fire" },
              { trait_type: "Anomaly", value: "none" },
            ],
          },
        }
      );

      return pinataResponse.data;
    } catch (error) {
      console.error("Error getting and uploading image:", error);
      throw error;
    }
  };

  const mintNFT = async (): Promise<void> => {
    if (!publicKey || !metaplex) return;

    try {
      setMinting(true);

      // 1. Get image and upload to Pinata
      const { metadataUri, imageUri } = await getImageAndUpload();
      console.log("Metadata URI:", metadataUri);

      // 2. Mint NFT using Metaplex - using the correct approach
      const { blockhash } = await connection!.getLatestBlockhash();

      // Create the NFT using the standard create method
      const { nft } = await metaplex.nfts().create(
        {
          uri: metadataUri,
          name: "Beast Legend NFT",
          symbol: "BEAST",
          sellerFeeBasisPoints: 500, // 5% royalty
        },
        { commitment: "confirmed" }
      );

      console.log("Mint address:", nft.address.toString());

      // Create a simplified NFT object with the data we already have
      const simplifiedNFT = {
        address: nft.address.toString(),
        json: {
          name: "Beast Legend NFT",
          image: imageUri,
          attributes: [
            { trait_type: "Type", value: "Dragon" },
            { trait_type: "Element", value: "Earth" },
            { trait_type: "Anomaly", value: "Wings, Armored" },
            { trait_type: "Rarity", value: "Mythic" },
          ],
        },
      };

      setMintedNFT(simplifiedNFT);
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Navigation />
      <div className="pt-24 mx-auto px-12 font-sans text-white flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-8 font-dark-mystic">
          Mint Your Beast
        </h1>
        <div
          className={`flex items-center justify-center transition-all duration-300 rounded-lg relative w-fit ${
            minting || !publicKey
              ? "cursor-not-allowed opacity-50"
              : "group hover:scale-105 cursor-pointer shadow-2xl shadow-white/50"
          }`}
          onClick={minting || !publicKey ? undefined : mintNFT}
        >
          <Image
            src="/mint/back-card.png"
            alt="Mint Your Beast"
            width={400}
            height={700}
            className="rounded-lg group-hover:brightness-50"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <h1 className="hidden group-hover:block text-6xl font-bold text-center mb-8 font-dark-mystic">
              {minting ? "Creating Your NFT..." : "Mint"}
            </h1>
          </div>
        </div>
        
        <div>
          {minting && (
            <div className="mt-8 text-center">
              <TypeAnimation
                sequence={[
                  "Getting image...",
                  1000,
                  "Uploading to IPFS...",
                  1000,
                  "Creating blockchain transaction...",
                  1000,
                  "Minting...",
                  1000,
                ]}
                wrapper="span"
                speed={60}
                className="text-xl font-bold text-center mb-8 font-dark-mystic text-white/80"
              />
            </div>
          )}
        </div>
        {/* <div className="flex flex-col items-center mb-12">
        <button 
          className={`px-8 py-4 rounded-lg text-xl font-bold transition-colors ${
            minting || !publicKey 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
          }`}
          onClick={mintNFT} 
          disabled={minting || !publicKey}
        >
          {minting ? 'Creating Your NFT...' : 'Mint Simple NFT'}
        </button>
        
        {minting && (
          <div className="mt-8 text-center">
            <p className="opacity-80 animate-pulse">Getting image...</p>
            <p className="opacity-80 animate-pulse delay-100">Uploading to IPFS...</p>
            <p className="opacity-80 animate-pulse delay-200">Creating blockchain transaction...</p>
          </div>
        )}
      </div> */}

        {mintedNFT && (
          <div className="mt-8 flex flex-col items-center ">
            <h2 className="text-2xl font-bold mb-4">Successfully Minted!</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md">
              {mintedNFT.json && mintedNFT.json.image ? (
                <img
                  src={mintedNFT.json.image}
                  alt="Minted NFT"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Image loading...</p>
                </div>
              )}
              <div className="p-6 text-black">
                <h3 className="text-xl font-semibold mb-4">
                  {mintedNFT.json?.name || "Beast Legend NFT"}
                </h3>
                <div className="mb-6">
                  {mintedNFT.json?.attributes?.map((trait, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <span className="font-medium mr-2">
                        {trait.trait_type}:
                      </span>
                      <span className="text-gray-700">{trait.value}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="block mb-1">NFT Address:</span>
                  <a
                    href={`https://explorer.solana.com/address/${mintedNFT.address}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {mintedNFT.address.substring(0, 8)}...
                    {mintedNFT.address.substring(mintedNFT.address.length - 8)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
