"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Metaplex, walletAdapterIdentity, sol, toBigNumber, NftWithToken } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from '@solana/wallet-adapter-react';
import Image from "next/image";

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    mintAddress: string;
    name: string;
    image: string;
  };
  onSuccess: () => void;
}

export default function ListingModal({ isOpen, onClose, nft, onSuccess }: ListingModalProps) {
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  const handleListing = async () => {
    if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
      alert("Please connect your wallet first");
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      setLoading(true);
      const connection = new Connection(clusterApiUrl("devnet"));
      const metaplex = Metaplex.make(connection).use(
        walletAdapterIdentity({ publicKey: wallet.publicKey, signTransaction: wallet.signTransaction })
      );

      // Use the NFT's mint address
      const nftMintAddress = new PublicKey(nft.mintAddress);
      console.log('Using NFT mint address:', nftMintAddress.toString());

      // Find the auction house
      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(process.env.NEXT_PUBLIC_AUCTION_HOUSE_ADDRESS!)
      });

      console.log('Found auction house:', auctionHouse.address.toString());

      // Get the token account for this NFT
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      console.log('All token accounts:', tokenAccounts.value.map(acc => ({
        pubkey: acc.pubkey.toString(),
        mint: acc.account.data.parsed.info.mint,
        amount: acc.account.data.parsed.info.tokenAmount.amount
      })));

      // Try to find the token account by mint
      const tokenAccount = tokenAccounts.value.find(
        account => account.account.data.parsed.info.mint === nftMintAddress.toString()
      );

      if (!tokenAccount) {
        console.error('No token account found for mint:', nftMintAddress.toString());
        throw new Error("No token account found for this NFT. Please make sure you own this NFT.");
      }

      console.log('Found token account:', {
        pubkey: tokenAccount.pubkey.toString(),
        mint: tokenAccount.account.data.parsed.info.mint,
        amount: tokenAccount.account.data.parsed.info.tokenAmount.amount
      });

      const tokenAccountInfo = tokenAccount.account.data.parsed.info;
      if (tokenAccountInfo.tokenAmount.amount === "0") {
        throw new Error("You don't own this NFT");
      }

      // Create the listing
      console.log('Creating listing with parameters:', {
        auctionHouse: auctionHouse.address.toString(),
        seller: wallet.publicKey.toString(),
        authority: auctionHouse.authorityAddress.toString(),
        mintAccount: nftMintAddress.toString(),
        tokenAccount: tokenAccount.pubkey.toString(),
        price: Number(price),
        tokens: 1
      });

      // Create the listing with proper price handling
      const { listing } = await metaplex.auctionHouse().list({
        auctionHouse,
        seller: metaplex.identity(),
        authority: auctionHouse.authorityAddress,
        mintAccount: nftMintAddress,
        tokenAccount: new PublicKey(tokenAccount.pubkey),
        price: sol(Number(price))
      });

      console.log('Listing created successfully:', listing);

      alert("Listing created successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating listing:', error);
      if (error.message.includes("AccountNotFoundError")) {
        alert('NFT metadata not found. Please make sure you are using the correct NFT address.');
      } else {
        alert(error.message || 'Failed to create listing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Panel className="relative bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
          <Dialog.Title className="text-2xl font-bold text-white mb-4">
            List Your NFT
          </Dialog.Title>

          <div className="mb-6">
            <Image
              src={nft.image}
              alt={nft.name}
              width={1000}
              height={1000}
              className="w-full h-full object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl text-white mb-2">{nft.name}</h3>
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2">Price (SOL)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter price in SOL"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white hover:text-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleListing}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 