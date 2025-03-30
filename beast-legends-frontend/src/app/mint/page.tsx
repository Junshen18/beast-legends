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
import beastsData from "../data/beasts.json";
import Modal from "../components/Modal";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";

interface PinataResponse {
  imageUri: string;
  metadataUri: string;
}

interface MintedNFT {
  address: string;
  json: {
    name: string;
    image: string;
    symbol: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

interface Beast {
  name: string;
  img?: string;
  rarity: string;
  stats: {
    dodge: number;
    health: number;
    attack: {
      min: number;
      max: number;
    };
  };
  type: string;
  element: string;
  anomaly: boolean | string;
}

export default function SimpleMintPage() {
  const { publicKey, signTransaction } = useWallet();
  const [minting, setMinting] = useState<boolean>(false);
  const [mintedNFT, setMintedNFT] = useState<MintedNFT | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [metaplex, setMetaplex] = useState<any>(null);
  const [selectedBeast, setSelectedBeast] = useState<Beast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  // Function to select a random beast based on rarity rates
  const selectRandomBeast = (): Beast => {
    // Rarity rates: Common 60%, Rare 30%, Epic 8.5%, Mythic 1.5%
    const rarityRates = {
      Common: 60,
      Rare: 30,
      Epic: 8.5,
      Mythic: 1.5
    };
    
    // Generate a random number between 0 and 100
    const randomValue = Math.random() * 100;
    
    // Determine the rarity based on the random value
    let selectedRarity: string;
    let cumulativeRate = 0;
    
    for (const [rarity, rate] of Object.entries(rarityRates)) {
      cumulativeRate += rate;
      if (randomValue <= cumulativeRate) {
        selectedRarity = rarity;
        break;
      }
    }
    
    // Filter beasts by the selected rarity
    const beastsOfSelectedRarity = beastsData.beasts.filter(
      (beast: Beast) => beast.rarity === selectedRarity
    );
    
    // If no beasts of the selected rarity, fallback to any beast
    if (beastsOfSelectedRarity.length === 0) {
      const randomIndex = Math.floor(Math.random() * beastsData.beasts.length);
      return beastsData.beasts[randomIndex];
    }
    
    // Select a random beast from the filtered list
    const randomIndex = Math.floor(Math.random() * beastsOfSelectedRarity.length);
    return beastsOfSelectedRarity[randomIndex];
  };

  const prepareBeastData = async (): Promise<{ beast: Beast; imageUri: string; metadataUri: string }> => {
    // Select a random beast based on rarity rates
    const beast = selectRandomBeast();
    setSelectedBeast(beast);
    
    // Get image from the beast data or use a default image
    const beastImage = beast.img || "/mint/back-card.png";
    
    // First, get the image as base64
    const imageResponse = await axios.post('/api/compose-image', {
      imagePath: beastImage
    });
    
    const base64Image = imageResponse.data.composedImage;

    // Upload to Pinata
    const pinataResponse = await axios.post<PinataResponse>(
      "/api/upload-to-pinata",
      {
        image: base64Image,
        metadata: {
          name: beast.name,
          description: `A powerful ${beast.rarity.toLowerCase()} ${beast.type.toLowerCase()} with ${beast.element.toLowerCase()} powers.${beast.anomaly !== "None" ? ` Special anomaly: ${beast.anomaly}` : ''}`,
          attributes: [
            { trait_type: "Type", value: beast.type },
            { trait_type: "Element", value: beast.element },
            { trait_type: "Anomaly", value: typeof beast.anomaly === 'boolean' ? (beast.anomaly ? "Yes" : "None") : beast.anomaly },
            { trait_type: "Rarity", value: beast.rarity },
            { trait_type: "Health", value: beast.stats.health.toString() },
            { trait_type: "Dodge", value: beast.stats.dodge.toString() },
            { trait_type: "Attack Min", value: beast.stats.attack.min.toString() },
            { trait_type: "Attack Max", value: beast.stats.attack.max.toString() },
          ],
        },
      }
    );

    return {
      beast,
      imageUri: pinataResponse.data.imageUri,
      metadataUri: pinataResponse.data.metadataUri
    };
  };

  const createNFT = async (metadataUri: string, beast: Beast): Promise<string> => {
    const { nft } = await metaplex.nfts().create(
      {
        uri: metadataUri,
        name: beast.name,
        symbol: "BEAST",
        sellerFeeBasisPoints: 500, // 5% royalty
      },
      { commitment: "confirmed" }
    );

    return nft.address.toString();
  };

  const createNFTDisplayData = (address: string, beast: Beast, imageUri: string): MintedNFT => {
    return {
      address,
      json: {
        name: beast.name,
        image: imageUri,
        symbol: "BEAST",
        description: `A powerful ${beast.rarity.toLowerCase()} ${beast.type.toLowerCase()} with ${beast.element.toLowerCase()} powers.${beast.anomaly !== "None" ? ` Special anomaly: ${beast.anomaly}` : ''}`,
        attributes: [
          { trait_type: "Type", value: beast.type },
          { trait_type: "Element", value: beast.element },
          { trait_type: "Anomaly", value: typeof beast.anomaly === 'boolean' ? (beast.anomaly ? "Yes" : "None") : beast.anomaly },
          { trait_type: "Rarity", value: beast.rarity },
          { trait_type: "Health", value: beast.stats.health.toString() },
          { trait_type: "Dodge", value: beast.stats.dodge.toString() },
          { trait_type: "Attack Min", value: beast.stats.attack.min.toString() },
          { trait_type: "Attack Max", value: beast.stats.attack.max.toString() },
        ],
      },
    };
  };

  const mintNFT = async (): Promise<void> => {
    if (!publicKey || !metaplex) return;

    try {
      setMinting(true);

      // 1. Prepare beast data and upload to IPFS
      const { beast, imageUri, metadataUri } = await prepareBeastData();
      console.log("Metadata URI:", metadataUri);
      console.log("Image URI:", imageUri);

      // 2. Create NFT on blockchain
      const nftAddress = await createNFT(metadataUri, beast);
      console.log("Mint address:", nftAddress);

      // 3. Create display data
      const nftDisplayData = createNFTDisplayData(nftAddress, beast, imageUri);
      console.log("Minted NFT Data:", nftDisplayData);

      // 4. Update UI
      setMintedNFT(nftDisplayData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Navigation />
      <div className="pt-24 mx-auto px-12 font-sans text-white flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-center font-dark-mystic">
          Mint Your Beast
        </h1>
        
        {/* Rarity Chances Display */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-gray-800"></div>
              <div className="absolute inset-0 rounded-full bg-green-500" style={{ clipPath: 'inset(40% 0 0 0)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">60%</span>
              </div>
            </div>
            <span className="mt-2 text-green-400 font-medium text-sm">Common</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-gray-800"></div>
              <div className="absolute inset-0 rounded-full bg-blue-500" style={{ clipPath: 'inset(70% 0 0 0)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">30%</span>
              </div>
            </div>
            <span className="mt-2 text-blue-400 font-medium text-sm">Rare</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-gray-800"></div>
              <div className="absolute inset-0 rounded-full bg-purple-500" style={{ clipPath: 'inset(91.5% 0 0 0)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">8.5%</span>
              </div>
            </div>
            <span className="mt-2 text-purple-400 font-medium text-sm">Epic</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-gray-800"></div>
              <div className="absolute inset-0 rounded-full bg-yellow-500" style={{ clipPath: 'inset(98.5% 0 0 0)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">1.5%</span>
              </div>
            </div>
            <span className="mt-2 text-yellow-400 font-medium text-sm">Mythic</span>
          </div>
        </div>

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

        {!publicKey && (
          <div className="mt-8 text-center">
            <h1 className="text-2xl font-bold text-center mb-8 font-dark-mystic">
              Please connect your wallet to mint
            </h1>
          </div>
        )}
        
        <div>
          {minting && (
            <div className="mt-8 text-center">
              <TypeAnimation
                sequence={[
                  "Selecting your beast...",
                  1000,
                  "Determining rarity...",
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
      </div>

      {/* Minted NFT Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {mintedNFT && (
          <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                Successfully Minted!
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                {mintedNFT.json.name}
              </CardItem>
              <CardItem translateZ="100" className="w-full h-full mt-4">
                <Image
                  src={mintedNFT.json.image}
                  height="1000"
                  width="1000"
                  className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt={mintedNFT.json.name}
                />
              </CardItem>
              <div className="mt-6">
                <CardItem
                  translateZ="40"
                  className="text-neutral-500 text-sm dark:text-neutral-300"
                >
                  Attributes
                </CardItem>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {mintedNFT.json.attributes.map((attr, index) => (
                    <CardItem
                      key={index}
                      translateZ="30"
                      className="text-sm dark:text-white"
                    >
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {attr.trait_type}:
                      </span>{" "}
                      <span className="font-medium">{attr.value}</span>
                    </CardItem>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <CardItem
                  translateZ="20"
                  className="text-xs text-neutral-500 dark:text-neutral-400"
                >
                  NFT Address:{" "}
                  <a
                    href={`https://explorer.solana.com/address/${mintedNFT.address}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    {mintedNFT.address.substring(0, 8)}...
                    {mintedNFT.address.substring(mintedNFT.address.length - 8)}
                  </a>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        )}
      </Modal>
    </div>
  );
}
