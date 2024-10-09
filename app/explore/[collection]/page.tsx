"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NFTModal } from "@/components/Modal";

interface NFT {
  id: number;
  name: string;
  image: string;
  tokenId: string;
}

export default function CollectionPage({ params }: { params: { collection: string } }) {
  const { collection } = params;
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  // Placeholder data; replace with actual data fetching logic based on `collection`
  const nfts: NFT[] = [
    {
      id: 1,
      name: `${collection} #1`,
      image: `/${collection}/${collection}-1.jpeg`,
      tokenId: "0x123...456",
    },
    {
      id: 2,
      name: `${collection} #2`,
      image: `/${collection}/${collection}-2.jpeg`,
      tokenId: "0x789...012",
    },
    // Add more NFTs as needed
  ];

  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      <div className="w-full flex justify-start">
        <Link href="/explore" className="px-4 rounded-full text-md font-medium font-twk-lausanne transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 mb-6 bg-white text-black focus:ring-black">
          Back
        </Link>
      </div>
      
      <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
        {collection}
      </h1>
      
      <p className="text-md font-extralight text-center text-custom-black mb-4 max-w-xl px-4">
        Browse through all {collection} NFTs.
      </p>

      <hr className="w-11/12 max-w-md border-t border-custom-white mb-6 mt-2 mx-8" />

      <motion.div 
        className="grid grid-cols-2 gap-6 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {nfts.map((nft) => (
          <motion.div
            key={nft.id}
            className="bg-white overflow-hidden duration-300 cursor-pointer"
            onClick={() => setSelectedNFT(nft)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
            <div className="py-4">
              <h2 className="text-md font-semibold mb-2 text-custom-black">{nft.name}</h2>
              <p className="text-sm text-gray-600 mb-2">Token ID: {nft.tokenId}</p>
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