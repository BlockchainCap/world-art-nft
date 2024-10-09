"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from 'next/navigation';


interface NFT {
  id: number;
  name: string;
  image: string;
  tokenId: string;
  collection: string;
  rarity: string;
}

export default function MyNFTs() {
  const router = useRouter();

  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  // Placeholder data;
  const myNFTs: NFT[] = [
    {
      id: 1,
      name: "Unique Human #3412",
      image: "/UH_rectangle.png",
      tokenId: "0x123...456",
      collection: "Unique Humans",
      rarity: "Legendary",
    },

    // This is currently hardcoded, but in the future we will fetch this from the backend
  ];

  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      <div className="w-full flex justify-start">
        <Link href="/" className="px-4 rounded-full text-md font-medium font-twk-lausanne transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 mb-6 bg-white text-black focus:ring-black">
          Back
        </Link>
      </div>
      
      <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
        My NFTs
      </h1>
      
      <p className="text-md font-extralight text-center text-custom-black mb-4 max-w-xl px-4">
        View and manage your collection from World Art.
      </p>

      <hr className="w-11/12 max-w-md border-t border-custom-white mb-6 mt-2 mx-8" />

      <motion.div 
        className="grid grid-cols-2 gap-6 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {myNFTs.map((nft) => (
          <motion.div
            key={nft.id}
            className="bg-white overflow-hidden duration-300 cursor-pointer"
            onClick={() => router.push('/?viewMinted=true')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
            <div className="py-4">
              <h2 className="text-md font-semibold mb-2 text-custom-black">{nft.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{nft.collection}</p>
            
            </div>
          </motion.div>
        ))}
      </motion.div>
      

    </div>
  );
}

