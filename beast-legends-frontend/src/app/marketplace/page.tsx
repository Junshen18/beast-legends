"use client";
import { useEffect, useState } from "react";
import Navigation from "../components/landing-page/Navigation";
import NFTGrid from "../components/marketplace/NFTGrid";
import FilterSection from "../components/marketplace/FilterSection";
import ListingModal from "../components/marketplace/ListingModal";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { Listing as MetaplexListing, LazyListing, NftWithToken } from "@metaplex-foundation/js";

interface Listing {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
  attributes: Record<string, string>;
  listing: MetaplexListing | LazyListing;
}

interface UserNFT {
  address: string;
  mintAddress: string;
  name: string;
  image: string;
  symbol: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

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

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<{ mint: string; name: string; image: string; } | null>(null);
  const [showUserNFTs, setShowUserNFTs] = useState(false);
  const wallet = useWallet();
  
  // Add filter state
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 5 },
    rarity: [],
    attributes: {},
    sortBy: "price_low_to_high"
  });

  const fetchUserNFTs = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return;

    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const metaplex = Metaplex.make(connection).use(
        walletAdapterIdentity({ publicKey: wallet.publicKey, signTransaction: wallet.signTransaction })
      );

      // Fetch all NFTs owned by the wallet
      const allNfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: wallet.publicKey });

      // Filter to only include your project's NFTs (with symbol "BEAST")
      const beastNfts = allNfts.filter(
        (nft: any) => nft.symbol && nft.symbol.trim().toUpperCase() === "BEAST"
      );

      // Format the NFT data for display
      const formattedNfts = await Promise.all(
        beastNfts.map(async (nft: any) => {
          let metadata = null;
          try {
            if (nft.uri) {
              const response = await fetch(
                nft.uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
              );
              metadata = await response.json();
            }
          } catch (error) {
            console.error("Error fetching metadata for NFT:", nft.address.toString(), error);
          }

          return {
            address: nft.address.toString(),
            mintAddress: nft.mintAddress.toString(),
            name: nft.name || "Unnamed NFT",
            image: metadata?.image?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") || "/placeholder.png",
            symbol: nft.symbol || "",
            attributes: metadata?.attributes || [],
          };
        })
      );

      setUserNFTs(formattedNfts);
      setShowUserNFTs(true);
    } catch (error) {
      console.error("Error fetching user NFTs:", error);
    }
  };

  const fetchListings = async () => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const metaplex = new Metaplex(connection);
      
      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(process.env.NEXT_PUBLIC_AUCTION_HOUSE_ADDRESS!)
      });

      const fetchedListings = await metaplex.auctionHouse().findListings({
        auctionHouse
      });

      const transformedListings = await Promise.all(
        (fetchedListings as any[]).map(async (listing) => {
          const asset = 'lazy' in listing ? await listing.asset : listing.asset;
          return {
            id: asset.address.toString(),
            name: asset.name,
            image: asset.json.image,
            price: listing.price.basisPoints.toNumber() / 1e9,
            rarity: asset.json.attributes.find((attr: any) => attr.trait_type === "Rarity")?.value || "Common",
            attributes: asset.json.attributes.reduce((acc: any, attr: any) => {
              acc[attr.trait_type] = attr.value;
              return acc;
            }, {}),
            listing: listing
          };
        })
      );

      setListings(transformedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleListingSuccess = () => {
    // Refresh listings after successful listing
    fetchListings();
    setShowUserNFTs(false);
  };

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-24 px-12 pb-24">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold text-white font-dark-mystic">Marketplace</h1>
          {wallet.connected && (
            <button
              onClick={fetchUserNFTs}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium"
            >
              List Your NFT
            </button>
          )}
        </div>
        <div className="flex gap-8">
          <FilterSection filters={filters} setFilters={setFilters} />
          <NFTGrid 
            items={showUserNFTs ? userNFTs : listings} 
            filters={filters}
            loading={loading}
            wallet={wallet}
            onListNFT={(nft) => {
              if (!nft.mintAddress) {
                console.error('No mint address provided for NFT');
                return;
              }
              console.log('Selected NFT:', {
                mintAddress: nft.mintAddress,
                name: nft.name,
                image: nft.image
              });
              setSelectedNFT({
                mint: nft.mintAddress,
                name: nft.name,
                image: nft.image
              });
            }}
          />
        </div>
      </div>

      {selectedNFT && (
        <ListingModal
          isOpen={!!selectedNFT}
          onClose={() => setSelectedNFT(null)}
          nft={{
            mintAddress: selectedNFT.mint,
            name: selectedNFT.name,
            image: selectedNFT.image
          }}
          onSuccess={handleListingSuccess}
        />
      )}
    </main>
  );
}