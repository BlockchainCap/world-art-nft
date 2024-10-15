"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createPublicClient, http, Chain } from "viem";
import { worldartABI } from "../../contracts/worldartABI";

const worldChainSepolia: Chain = {
  id: 4801,
  name: 'World Chain Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL!],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL!],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://worldchain-sepolia.explorer.alchemy.com/' },
  },
};

const contractAddress = '0xB03d978aC6a5B7d565431eF71b80b4191419A627';

interface NFT {
  id: number;
  name: string;
  image: string;
  tokenId: string;
  tokenURI: string;
}

export default function Gallery() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ReturnType<typeof createPublicClient> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) {
      const newClient = createPublicClient({
        chain: worldChainSepolia,
        transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
      });
      setClient(newClient);
    }
  }, []);

  useEffect(() => {
    if (client) {
      fetchNFTs();
    }
  }, [client]);

  async function fetchNFTs() {
    if (!client) return;

    try {
      setLoading(true);

      const totalSupply = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'totalSupply',
      }) as bigint;

      console.log("Total supply:", totalSupply.toString());

      const fetchedNFTs = await Promise.all(
        Array.from({ length: Number(totalSupply) }, (_, i) => i).map(fetchNFTData)
      );

      setNfts(fetchedNFTs.filter((nft): nft is NFT => nft !== null));
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchNFTData(tokenId: number): Promise<NFT | null> {
    if (!client) return null;

    try {
      const tokenURI = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'tokenURI',
        args: [BigInt(tokenId)],
      }) as string;

      console.log(`Token ${tokenId} URI:`, tokenURI);

      let metadata;
      try {
        const response = await fetch(tokenURI);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        metadata = await response.json();
      } catch (error) {
        console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
        return createPlaceholderNFT(tokenId, tokenURI);
      }

      return {
        id: tokenId,
        name: metadata.name || `Unique Human #${tokenId}`,
        image: metadata.image || '/circle.jpg',
        tokenId: tokenId.toString(),
        tokenURI: tokenURI,
      };
    } catch (error) {
      console.error(`Error fetching NFT data for token ${tokenId}:`, error);
      return createPlaceholderNFT(tokenId, 'Error fetching tokenURI');
    }
  }

  function createPlaceholderNFT(tokenId: number, tokenURI: string): NFT {
    return {
      id: tokenId,
      name: `Unique Human #${tokenId}`,
      image: '/circle.jpg',
      tokenId: tokenId.toString(),
      tokenURI: tokenURI,
    };
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      <div className="w-full flex justify-start">
        <Link href="/" className="px-4 rounded-full text-md font-medium font-twk-lausanne transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 mb-6 bg-white text-black focus:ring-black">
          Back
        </Link>
      </div>
      
      <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
        Unique Humans Gallery
      </h1>
      
      <p className="text-md font-extralight text-center text-custom-black mb-4 max-w-xl px-4">
        View all minted Unique Humans from World Art.
      </p>

      <hr className="w-11/12 max-w-md border-t border-custom-white mb-6 mt-2 mx-8" />

      {loading ? (
        <p>Loading NFTs...</p>
      ) : (
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={nft.tokenURI} alt={nft.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{nft.name}</h2>
                <p className="text-gray-600 text-sm break-all">Token URI: {nft.tokenURI}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
