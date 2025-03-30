"use client";

import React from "react";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Modal from "./Modal";

interface NFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    address: string;
    name: string;
    image: string;
    symbol: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export default function NFTModal({ isOpen, onClose, nft }: NFTModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {nft.name}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            {nft.symbol}
          </CardItem>
          <CardItem translateZ="100" className="w-full h-full mt-4">
            <Image
              src={nft.image}
              height="1000"
              width="1000"
              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt={nft.name}
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
              {nft.attributes.map((attr, index) => (
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
                href={`https://explorer.solana.com/address/${nft.address}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400"
              >
                {nft.address.substring(0, 8)}...
                {nft.address.substring(nft.address.length - 8)}
              </a>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </Modal>
  );
} 