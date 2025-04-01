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
import NFTModal from "../components/NFTModal";

interface NFTData {
  address: string;
  mintAddress: string;
  name: string;
  image: string;
  symbol: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  isListed?: boolean;
  listingPrice?: number;
  count?: number;
  allMintAddresses?: string[];
}

export default function ProfilePage() {
  const { publicKey, signTransaction } = useWallet();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [metaplex, setMetaplex] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Helper function to convert IPFS URLs to HTTP URLs
  const convertIPFStoHTTP = (url: string) => {
    if (!url) return url;
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    }
    return url;
  };

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

  const checkIfNFTIsListed = async (mintAddress: string) => {
    if (!metaplex) return null;

    try {
      // Fetch the auction house address from the config
      const response = await fetch('/api/config');
      const config = await response.json();
      const auctionHouseAddress = new PublicKey(config.auctionHouseAddress);

      // Find the auction house
      const auctionHouse = await metaplex
        .auctionHouse()
        .findByAddress({ address: auctionHouseAddress });

      // Find all listings for the NFT
      const listings = await metaplex
        .auctionHouse()
        .findListings({
          auctionHouse,
          filter: {
            mint: new PublicKey(mintAddress),
          },
        });

      if (listings.length > 0) {
        // Get the first active listing
        const listing = listings[0];
        
        // Check if the listing is still valid
        try {
          const listingStatus = await metaplex.auctionHouse().findListingByTradeState({
            tradeStateAddress: listing.tradeStateAddress,
            auctionHouse
          });

          // If listing exists and is not cancelled, return the listing info
          if (listingStatus && !(listingStatus as any).canceledAt) {
            return {
              isListed: true,
              price: listing.price.basisPoints.toNumber() / 1e9,
            };
          }
        } catch (error) {
          console.log("Listing no longer exists or has been cancelled:", listing.tradeStateAddress.toString());
        }
      }

      return { isListed: false };
    } catch (error) {
      console.error('Error checking listing status:', error);
      return null;
    }
  };

  const fetchUserNFTs = async () => {
    if (!publicKey || !metaplex) return;

    try {
      setLoading(true);

      // Fetch all NFTs owned by the wallet
      const allNfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: publicKey });
      console.log("All NFTs:", allNfts);

      // Filter to only include your project's NFTs (with symbol "BEAST")
      const beastNfts = allNfts.filter(
        (nft: any) => nft.symbol && nft.symbol.trim().toUpperCase() === "BEAST"
      );

      // Group identical NFTs by name and attributes
      const nftGroups = new Map<string, NFTData[]>();

      // Format and group the NFT data
      for (const nft of beastNfts) {
        let metadata = null;
        try {
          if (nft.uri) {
            const httpUri = convertIPFStoHTTP(nft.uri);
            const response = await fetch(httpUri);
            metadata = await response.json();
          }
        } catch (error) {
          console.error("Error fetching metadata for NFT:", nft.address.toString(), error);
        }

        // Create a unique key based on name and attributes
        const attributes = metadata?.attributes || [];
        const key = `${nft.name}-${attributes.map((attr: any) => `${attr.trait_type}:${attr.value}`).join('|')}`;

        const nftData: NFTData = {
          address: nft.address.toString(),
          mintAddress: nft.mintAddress.toString(),
          name: nft.name || "Unnamed NFT",
          image: convertIPFStoHTTP(metadata?.image) || "/placeholder.png",
          symbol: nft.symbol || "",
          attributes: attributes,
          allMintAddresses: [nft.mintAddress.toString()]
        };

        // Check if the NFT is listed
        const listingStatus = await checkIfNFTIsListed(nft.mintAddress.toString());
        nftData.isListed = listingStatus?.isListed || false;
        nftData.listingPrice = listingStatus?.price;

        if (nftGroups.has(key)) {
          const group = nftGroups.get(key)!;
          group[0].count = (group[0].count || 1) + 1;
          group[0].allMintAddresses!.push(nft.mintAddress.toString());
        } else {
          nftGroups.set(key, [nftData]);
        }
      }

      // Convert groups to array and sort by count
      const formattedNfts = Array.from(nftGroups.values())
        .map(group => group[0])
        .sort((a, b) => (b.count || 1) - (a.count || 1));

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
          mintAddress: nft.mintAddress.toString(),
          name: nft.name || "Unnamed NFT",
          image: convertIPFStoHTTP(nft.json?.image) || "/placeholder.png",
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
      <div className="max-w-6xl mx-auto p-8 font-sans text-white h-3/4">
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
            <div className="text-center py-12 h-3/4">
              <p className="text-xl mb-4 text-white">
                Connect your wallet to view your collection
              </p>
              <div className="h-[300px]"></div>
            </div>
          ) : loading ? (
            <div className="text-center py-12 h-3/4">
              <p className="text-xl animate-pulse text-white">Loading your NFTs...</p>
              <div className="h-[300px]"></div>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12 h-3/4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-6">
                {nfts.map((nft) => (
                  <div
                    key={nft.address}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg text-white cursor-pointer hover:scale-105 transition-transform duration-200 relative"
                    onClick={() => {
                      setSelectedNFT(nft);
                      setIsModalOpen(true);
                    }}
                  >
                    {nft.count && nft.count > 1 && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                        x{nft.count}
                      </div>
                    )}
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      width={400}
                      height={400}
                      className="w-full h-fill object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{nft.name}</h3>
                      {/* {nft.isListed && nft.listingPrice && (
                        <div className="text-sm text-purple-400 mb-2">
                          Price: {nft.listingPrice} SOL
                        </div>
                      )} */}
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
                          href={`https://explorer.solana.com/address/${nft.mintAddress}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {nft.mintAddress.substring(0, 8)}...
                          {nft.mintAddress.substring(nft.mintAddress.length - 8)}
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

      {/* NFT Modal */}
      {selectedNFT && (
        <NFTModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNFT(null);
          }}
          nft={selectedNFT}
          onListingSuccess={() => {
            // Refresh NFTs after successful listing
            fetchUserNFTs();
          }}
        />
      )}
    </div>
  );
}