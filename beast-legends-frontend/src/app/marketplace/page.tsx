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
import Image from "next/image";
import Link from "next/link";

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
  onBuy: (listing: MetaplexListing | LazyListing) => Promise<void>;
  onCancelListing: (listing: MetaplexListing | LazyListing) => Promise<void>;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<{ mint: string; name: string; image: string; } | null>(null);
  const [showUserNFTs, setShowUserNFTs] = useState(false);
  const wallet = useWallet();
  
  // Helper function to convert IPFS URLs to HTTP URLs
  const convertIPFStoHTTP = (url: string) => {
    if (!url) return url;
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    }
    return url;
  };

  // Add filter state
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 20 },
    rarity: [],
    attributes: {},
    sortBy: "price_low_to_high"
  });

  const fetchListings = async () => {
    try {
        setLoading(true);
        const connection = new Connection(clusterApiUrl("devnet"));
        const metaplex = new Metaplex(connection);

        // Fetch auction house address from the API
        const response = await fetch('/api/config');
        if (!response.ok) {
            throw new Error('Failed to fetch config');
        }
        const config = await response.json();

        const auctionHouse = await metaplex.auctionHouse().findByAddress({
            address: new PublicKey(config.auctionHouseAddress),
        });

        console.log('Fetching listings for auction house:', auctionHouse.address.toString());

        const fetchedListings = await metaplex.auctionHouse().findListings({
            auctionHouse,
        });

        console.log('Found listings:', fetchedListings.length);
        console.log('Fetched listings:', fetchedListings);

        const transformedListings = await Promise.all(
            fetchedListings.map(async (listing) => {
                try {
                    // Ensure the listing is fully loaded
                    let loadedListing = listing;
                    if (listing.lazy) {
                        loadedListing = await metaplex.auctionHouse().loadListing({ lazyListing: listing });
                    }

                    // Get the NFT asset
                    const asset = (loadedListing as any).asset;
                    if (!asset) {
                        console.warn("Skipping listing without asset:", loadedListing);
                        return null; // Skip listings without assets
                    }

                    // Check if the listing is still valid and active
                    try {
                        const listingStatus = await metaplex.auctionHouse().findListingByTradeState({
                            tradeStateAddress: loadedListing.tradeStateAddress,
                            auctionHouse
                        });

                        // If we can find the listing, check if it's still active
                        if (!listingStatus || (listingStatus as any).canceledAt) {
                            console.log("Listing has been cancelled or is no longer valid:", loadedListing.tradeStateAddress.toString());
                            return null;
                        }
                    } catch (error) {
                        console.log("Listing no longer exists or has been cancelled:", loadedListing.tradeStateAddress.toString());
                        return null;
                    }

                    // Fetch metadata if URI is available
                    let metadata = null;
                    if (asset.uri) {
                        try {
                            const httpUri = convertIPFStoHTTP(asset.uri);
                            const response = await fetch(httpUri);
                            metadata = await response.json();
                        } catch (error) {
                            console.error("Error fetching metadata for NFT:", asset.address.toString(), error);
                        }
                    }

                    return {
                        id: asset.address.toString(),
                        name: asset.name || "Unnamed NFT",
                        image: convertIPFStoHTTP(metadata?.image) || "/placeholder.png",
                        price: (loadedListing as any).price.basisPoints.toNumber() / 1e9,
                        rarity: metadata?.attributes?.find((attr: any) => attr.trait_type === "Rarity")?.value || "Common",
                        attributes: metadata?.attributes?.reduce((acc: any, attr: any) => {
                            acc[attr.trait_type] = attr.value;
                            return acc;
                        }, {}) || {},
                        listing: loadedListing,
                    };
                } catch (err) {
                    console.error("Error processing listing:", listing.tradeStateAddress.toString(), err);
                    return null; // Skip invalid listings
                }
            })
        );

        // Remove null values (invalid listings, cancelled listings, or purchased NFTs)
        const validListings = transformedListings.filter((listing) => listing !== null);
        console.log('Final listings:', validListings);

        setListings(validListings);
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

  const handleBuy = async (listing: MetaplexListing | LazyListing) => {
    if (!wallet.connected || !wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    const connection = new Connection(clusterApiUrl("devnet"));
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity({ publicKey: wallet.publicKey, signTransaction: wallet.signTransaction })
    );

    try {
      // Fetch auction house address from the API
      const response = await fetch('/api/config');
      if (!response.ok) {
        throw new Error('Failed to fetch config');
      }
      const config = await response.json();

      // Get auction house
      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(config.auctionHouseAddress),
      });

      // Load the listing if it's lazy
      const loadedListing = listing.lazy
        ? await metaplex.auctionHouse().loadListing({ lazyListing: listing })
        : listing;

      // Get the price in SOL
      const listingPrice = (loadedListing as any).price;

      // Check buyer's escrow balance
      const buyerBalance = await metaplex.auctionHouse().getBuyerBalance({
        auctionHouse: auctionHouse.address,
        buyerAddress: wallet.publicKey,
      });

      console.log('Current buyer balance:', buyerBalance.basisPoints.toNumber() / 1e9);
      console.log('Required price:', listingPrice.basisPoints.toNumber() / 1e9);

      // If buyer doesn't have enough balance in escrow, deposit funds
      if (buyerBalance.basisPoints < listingPrice.basisPoints) {
        console.log('Depositing funds to buyer escrow...');
        try {
          await metaplex.auctionHouse().depositToBuyerAccount({
            auctionHouse,
            amount: listingPrice,
          });
          console.log('Successfully deposited funds to escrow');
        } catch (depositError) {
          console.error('Error depositing to escrow:', depositError);
          throw new Error('Failed to deposit funds to escrow. Please try again.');
        }
      }

      // Double check the balance after deposit
      const updatedBalance = await metaplex.auctionHouse().getBuyerBalance({
        auctionHouse: auctionHouse.address,
        buyerAddress: wallet.publicKey,
      });

      if (updatedBalance.basisPoints < listingPrice.basisPoints) {
        throw new Error('Insufficient funds in escrow account after deposit. Please try again.');
      }

      console.log('Executing buy transaction...');
      // Execute direct buy
      await metaplex.auctionHouse().buy({
        auctionHouse,
        listing: loadedListing,
      });

      alert('Purchase successful!');
      
      // Wait for a short time to ensure the blockchain state is updated
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh listings to remove the purchased NFT
      await fetchListings();
      
      // Force a re-render of the NFTGrid
      setListings(prevListings => [...prevListings]);
      
    } catch (error) {
      console.error('Error buying NFT:', error);
      
      // Try to withdraw funds from escrow if the buy failed
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const config = await response.json();
          const auctionHouse = await metaplex.auctionHouse().findByAddress({
            address: new PublicKey(config.auctionHouseAddress),
          });

          const buyerBalance = await metaplex.auctionHouse().getBuyerBalance({
            auctionHouse: auctionHouse.address,
            buyerAddress: wallet.publicKey,
          });

          if (buyerBalance.basisPoints > 0) {
            await metaplex.auctionHouse().withdrawFromBuyerAccount({
              auctionHouse,
              amount: buyerBalance,
            });
            console.log('Successfully withdrew funds from escrow after failed purchase');
          }
        }
      } catch (withdrawError) {
        console.error('Error withdrawing funds after failed purchase:', withdrawError);
      }

      alert('Failed to buy NFT. Please try again. If funds were deposited to escrow, they will be returned to your wallet.');
    }
  };

  const handleCancelListing = async (listing: MetaplexListing | LazyListing) => {
    if (!wallet.connected || !wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    const connection = new Connection(clusterApiUrl("devnet"));
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity({ publicKey: wallet.publicKey, signTransaction: wallet.signTransaction })
    );

    try {
      // Fetch auction house address from the API
      const response = await fetch('/api/config');
      if (!response.ok) {
        throw new Error('Failed to fetch config');
      }
      const config = await response.json();

      // Get auction house
      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(config.auctionHouseAddress),
      });

      // Load the listing if it's lazy
      const loadedListing = listing.lazy
        ? await metaplex.auctionHouse().loadListing({ lazyListing: listing })
        : listing;

      // Check if the current user is the seller
      const sellerAddress = (loadedListing as any).sellerAddress;
      if (sellerAddress.toString() !== wallet.publicKey.toString()) {
        alert("You can only cancel your own listings");
        return;
      }

      console.log('Cancelling listing...');
      // Cancel the listing
      await metaplex.auctionHouse().cancelListing({
        auctionHouse,
        listing: loadedListing,
      });

      alert('Listing cancelled successfully!');
      
      // Wait for a short time to ensure the blockchain state is updated
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh listings to remove the cancelled listing
      await fetchListings();
      
      // Force a re-render of the NFTGrid
      setListings(prevListings => [...prevListings]);
      
    } catch (error) {
      console.error('Error cancelling listing:', error);
      alert('Failed to cancel listing. Please try again.');
    }
  };

  // Collection stats (dummy data)
  const collectionStats = {
    totalVolume: "130 SOL",
    floorPrice: "4.5 SOL",
    bestOffer: "1.5 SOL",
    listed: "10%",
    owners: "26 (43%)"
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Mobile Warning - Only shown on small screens */}
      <div className="lg:hidden fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center">
        <Image
          src="/favicon.png"
          alt="Beast Legends"
          width={80}
          height={80}
          className="mb-6"
        />
        <h2 className="text-2xl font-bold text-white mb-4 font-dark-mystic">
          Please Open on Desktop
        </h2>
        <p className="text-gray-300 max-w-md mb-6">
          The Beast Legends marketplace is optimized for desktop viewing. Please open this page on a laptop or desktop computer for the best experience.
        </p>
        <Link 
          href="/"
          className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>

      {/* Main content - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:block">
        <Navigation />
        
        {/* Collection Banner */}
        <div className="w-full bg-gradient-to-b from-zinc-900 to-black">
          <div className="relative w-full h-[500px]">
            {/* Banner Image */}
            <div className="absolute inset-0">
              <Image
                src="/marketplace/marketplace-bg2.png"
                alt="Collection Banner"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
            </div>

            {/* Collection Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-start gap-6">
                {/* Collection Avatar */}
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-purple-500">
                  <Image
                    src="/favicon.png"
                    alt="Collection Avatar"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>

                {/* Collection Details */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2 font-dark-mystic">Beast Legends Collection</h1>
                  <p className="text-gray-300 mb-4 max-w-2xl">
                    Discover the mystical world of Beast Legends, where ancient creatures come to life as unique digital collectibles. Each beast carries its own story and power.
                  </p>
                  
                  {/* Collection Stats */}
                  <div className="flex gap-8 text-white">
                    <div>
                      <p className="text-xl font-bold">{collectionStats.totalVolume}</p>
                      <p className="text-sm text-gray-400">Total volume</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{collectionStats.floorPrice}</p>
                      <p className="text-sm text-gray-400">Floor price</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{collectionStats.bestOffer}</p>
                      <p className="text-sm text-gray-400">Best offer</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{collectionStats.listed}</p>
                      <p className="text-sm text-gray-400">Listed</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{collectionStats.owners}</p>
                      <p className="text-sm text-gray-400">Owners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Marketplace Content */}
        <div className="px-12 pb-24">
          <div className="flex justify-between items-center my-12">
            <h2 className="text-3xl font-bold text-white font-dark-mystic">Listed NFTs</h2>
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
              onBuy={handleBuy}
              onCancelListing={handleCancelListing}
            />
          </div>
        </div>

        {/* Listing Modal */}
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
      </div>
    </main>
  );
}