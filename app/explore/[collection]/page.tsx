"use client";

import React, { useState } from 'react';
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
    <div className="p-4">
      <h1 className="text-2xl mb-4">Collection: {collection}</h1>
      <div className="grid grid-cols-2 gap-4">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => setSelectedNFT(nft)}
          >
            <img src={nft.image} alt={nft.name} className="w-full h-auto rounded" />
            <p className="mt-2 text-custom-black">{nft.name}</p>
          </div>
        ))}
      </div>
      {selectedNFT && (
        <NFTModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />
      )}
    </div>
  );
}