"use client";

import React, { useState, useEffect } from "react";
import { NFTModal } from "@/components/Modal";
import { motion } from "framer-motion";

interface NFT {
  id: number;
  name: string;
  image: string;
  tokenId: string;
  collection: string;
  rarity: string;
}

export default function MyNFTs() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  // Placeholder data;
  const myNFTs: NFT[] = [
    {
      id: 1,
      name: "Cosmic Voyager #42",
      image: "/art.svg",
      tokenId: "0x123...456",
      collection: "Cosmic Voyagers",
      rarity: "Legendary",
    },
    {
      id: 2,
      name: "Digital Dreamscape #17",
      image: "/art2.svg",
      tokenId: "0x789...012",
      collection: "Digital Dreamscapes",
      rarity: "Rare",
    },
    // Add more NFTs as needed
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">My NFTs</h1>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {myNFTs.map((nft) => (
          <motion.div
            key={nft.id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => setSelectedNFT(nft)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 text-custom-white">{nft.name}</h2>
              <p className="text-sm text-gray-400 mb-2">{nft.collection}</p>
              <span className={`px-2 py-1 rounded-full text-xs ${nft.rarity === "Legendary" ? "bg-yellow-500 text-black" : "bg-blue-500 text-white"}`}>
                {nft.rarity}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {selectedNFT && (
        <NFTModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />
      )}
    </div>
  );
}

