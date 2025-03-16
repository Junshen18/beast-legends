"use client";

import React, { useState, useEffect, useRef } from "react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../components/landing-page/Navigation";
import { motion, useScroll, useTransform } from "framer-motion";

interface NFTData {
  address: string;
  name: string;
  image: string;
  symbol: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export default function ProfilePage() {
  const { publicKey, signTransaction } = useWallet();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [metaplex, setMetaplex] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  // Refs for scroll effect
  const collectionRef = useRef<HTMLDivElement>(null);
  
  // Setup the scroll animation
  const { scrollYProgress } = useScroll({
    target: collectionRef,
    offset: ["start end", "start start"]
  });
  
  // Transform scrollYProgress to translateY
  const translateY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

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

  // Fetch user's NFTs when wallet connects
  useEffect(() => {
    if (publicKey && metaplex) {
      fetchUserNFTs();
    } else {
      setNfts([]);
    }
  }, [publicKey, metaplex]);

  // Set mounted to true when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserNFTs = async () => {
    if (!publicKey || !metaplex) return;

    try {
      setLoading(true);

      // Fetch all NFTs owned by the wallet
      const allNfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: publicKey });
      console.log("All NFTs:", allNfts);

      // Log each NFT's symbol to debug
      allNfts.forEach((nft: any) => {
        console.log(
          `NFT ${nft.address.toString()} - Symbol: "${nft.symbol}", Name: "${
            nft.name
          }"`
        );
      });

      // Filter to only include your project's NFTs (with symbol "BEAST")
      // Use a case-insensitive comparison and trim any whitespace
      const beastNfts = allNfts.filter(
        (nft: any) => nft.symbol && nft.symbol.trim().toUpperCase() === "BEAST"
      );
      console.log("Beast NFTs:", beastNfts);

      // Format the NFT data for display
      const formattedNfts = await Promise.all(
        beastNfts.map(async (nft: any) => {
          // Try to load the JSON metadata
          let metadata = null;
          try {
            if (nft.uri) {
              console.log(`Fetching metadata from: ${nft.uri}`);
              const response = await fetch(
                nft.uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
              );
              metadata = await response.json();
              console.log(`Metadata for ${nft.address.toString()}:`, metadata);
            }
          } catch (error) {
            console.error(
              "Error fetching metadata for NFT:",
              nft.address.toString(),
              error
            );
          }

          return {
            address: nft.address.toString(),
            name: nft.name || "Unnamed NFT",
            image:
              metadata?.image?.replace(
                "ipfs://",
                "https://gateway.pinata.cloud/ipfs/"
              ) || "/placeholder.png",
            symbol: nft.symbol || "",
            attributes: metadata?.attributes || [],
          };
        })
      );

      // Check if the NFT is actually owned by the connected wallet
      const tokenAccounts = await connection!.getTokenAccountsByOwner(
        publicKey,
        {
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        }
      );

      console.log("Token accounts:", tokenAccounts);

      setNfts(formattedNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to fetch a specific NFT by mint address
  const fetchSpecificNFT = async (mintAddress: string) => {
    if (!metaplex) return;

    try {
      const nft = await metaplex.nfts().findByMint({
        mintAddress: new PublicKey(mintAddress),
        loadJsonMetadata: true,
      });

      console.log("Directly fetched NFT:", nft);

      // If this NFT belongs to your project, add it to the list
      if (nft.symbol === "BEAST") {
        const formattedNft = {
          address: nft.address.toString(),
          name: nft.name || "Unnamed NFT",
          image:
            nft.json?.image?.replace(
              "ipfs://",
              "https://gateway.pinata.cloud/ipfs/"
            ) || "/placeholder.png",
          symbol: nft.symbol || "",
          attributes: nft.json?.attributes || [],
        };

        // Add to the list if not already there
        setNfts((prev) => {
          if (!prev.some((item) => item.address === formattedNft.address)) {
            return [...prev, formattedNft];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error fetching specific NFT:", error);
    }
  };

  // Don't render wallet components until we're on the client
  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto p-8 font-sans text-white">
        <h1 className="text-4xl font-bold text-center mb-8">
          Your Beast Legends Collection
        </h1>
        <div className="text-center py-12">
          <p className="text-xl mb-4">Loading wallet connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navigation />
      {/* Top section - Profile - This becomes sticky */}
      <section className=" sticky top-0 overflow-hidden">
        <div className="pt-24 px-12 text-white h-full">
          <div className="flex flex-col gap-4 justify-center items-center py-12 mb-8 relative h-full">
            <Image
              src="/profile.png"
              alt="Beast Legends Logo"
              width={300}
              height={300}
              className="z-10 rounded-full"
            />
            <div className="z-10 font-dark-mystic text-4xl ">
              {publicKey?.toString().slice(0, 4)}...
              {publicKey?.toString().slice(-4)}
            </div>
            <div className="blur-lg bg-[url('/profile.png')] bg-cover bg-center w-full h-full absolute inset-0 z-0" />
          </div>
        </div>
      </section>

      {/* Bottom section - Collection - This will slide up to cover the profile */}
      <section ref={collectionRef} className=" h-[calc(100vh-6rem)] relative">
        <motion.div 
          style={{ translateY }}
          className="bg-black absolute w-full left-0 top-0 p-8"
        >
          <div className="text-4xl font-bold text-center mb-8 font-dark-mystic text-white">
            My Collection
          </div>
          
          {!publicKey ? (
            <div className="text-center py-12">
              <p className="text-xl mb-4 text-white">
                Connect your wallet to view your collection
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-xl animate-pulse text-white">Loading your NFTs...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl mb-4 text-white">
                No Beast Legends NFTs found in your wallet
              </p>
              <Link
                href="/mint"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium"
              >
                Mint Your First Beast
              </Link>
            </div>
          ) : (
            <div className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                {nfts.map((nft) => (
                  <div
                    key={nft.address}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg text-white"
                  >
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      width={400}
                      height={400}
                      className="w-full h-fill object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{nft.name}</h3>

                      <div className="mb-4">
                        {nft.attributes.map((attr, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm mb-1"
                          >
                            <span className="text-gray-400">
                              {attr.trait_type}:
                            </span>
                            <span className="font-medium">{attr.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-gray-400">
                        <span>NFT Address: </span>
                        <a
                          href={`https://explorer.solana.com/address/${nft.address}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {nft.address.substring(0, 8)}...
                          {nft.address.substring(nft.address.length - 8)}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}