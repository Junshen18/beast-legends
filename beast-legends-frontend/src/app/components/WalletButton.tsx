"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

interface WalletButtonProps {
  isOverWhiteSection?: boolean;
}

export default function WalletButton({ isOverWhiteSection }: WalletButtonProps) {
  const { publicKey, disconnect } = useWallet();

  if (!publicKey) {
    return (
      <div className={`px-4 py-0 cursor-pointer text-2xl w-[190px] group transition-colors duration-300 rounded-md flex items-center justify-center hover:backdrop-blur-md ${isOverWhiteSection ? 'hover:bg-black/20' : 'hover:bg-white'}`}>
        <WalletMultiButton
          style={{
            backgroundColor: "transparent",
            borderRadius: "0",
            border: "0",
            margin: "0",
            padding: "0",
            fontSize: "1.5rem",
            fontFamily: "var(--font-chillax)",
            height: "2.5rem",
          }}
        >
          <span className={`group-hover:text-black transition-colors duration-300 rounded-full flex items-center justify-center ${isOverWhiteSection ? 'text-black group-hover:text-white' : 'text-white group-hover:text-black'}`}>
            Connect
          </span>
        </WalletMultiButton>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Main button wrapper with padding to create hoverable area */}
      <div className="pb-3">
        <div
          className={`pointer-events-auto cursor-pointer px-4 py-2 z-[100] text-2xl w-[190px] group-hover:backdrop-blur-md flex items-center justify-center rounded-md ${
            isOverWhiteSection ? 'text-black group-hover:bg-black/10' : 'text-white group-hover:bg-black/20'
          }`}
        >
          {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-5)}
        </div>
      </div>
      
      {/* Dropdown Menu - positioned to remove gap */}
      <div className="absolute mt-2 right-0 top-[calc(100%-12px)] w-[190px] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        <div className={` rounded-md overflow-hidden ${
          isOverWhiteSection ? 'bg-white/30' : 'bg-black/30'
        }`}>
          <div
            className={`w-full text-left px-4 py-2 hover:bg-black/20 transition-colors cursor-pointer ${
              isOverWhiteSection ? 'text-black hover:text-white' : 'text-white'
            }`}
          >
            Profile
          </div>
          <div
            onClick={disconnect}
            className={`w-full text-left px-4 py-2 hover:bg-black/20 transition-colors cursor-pointer ${
              isOverWhiteSection ? 'text-black hover:text-white' : 'text-white'
            }`}
          >
            Disconnect
          </div>
        </div>
      </div>
    </div>
  );
} 
