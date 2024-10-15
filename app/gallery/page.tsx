"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPublicClient, http, Chain } from "viem";
import { worldartABI } from "../../contracts/worldartABI";
import { HamburgerMenu } from "../../components/HamburgerMenu";
import { worldChainSepolia } from "@/components/WorldChainViemClient";


const contractAddress = '0x4b8EF28b2e1A8F38e869E530E0AF5f9801a1A91D';

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
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      // Instead of fetching metadata, we'll use the tokenURI directly
      return {
        id: tokenId,
        name: `Unique Human #${tokenId}`,
        image: tokenURI, // Use tokenURI as the image source
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

  const openModal = (nft: NFT) => {
    setSelectedNFT(nft);
    document.body.classList.add('overflow-hidden');
  };

  const closeModal = () => {
    setSelectedNFT(null);
    document.body.classList.remove('overflow-hidden');
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <button
        onClick={handleMenuToggle}
        className="absolute pl-8 left-0 pb-4 text-custom-black hover:text-gray-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3.5" y1="14" x2="24.5" y2="14"></line>
          <line x1="3.5" y1="7" x2="24.5" y2="7"></line>
          <line x1="3.5" y1="21" x2="24.5" y2="21"></line>
        </svg>
      </button>
      
      <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
        UH Gallery
      </h1>
      
      <p className="text-md font-extralight text-center text-custom-black mb-4 max-w-xl px-4">
        View all minted Unique Humans from World Art.
      </p>

      <hr className="w-11/12 max-w-md border-t border-custom-white mb-6 mt-2 mx-8" />

      {loading ? (
        <p>Loading Editions...</p>
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
              onClick={() => openModal(nft)}
            >
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img src={nft.tokenURI} alt={nft.name} className="w-full h-full object-contain" />
              </div>
              <div className="p-4">
                <h2 className="text-md font-medium mb-2">{nft.name}</h2>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 min-h-screen"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="p-8 rounded-lg max-w-2xl relative"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={closeModal}
                  className="px-4 mt-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 text-white"
                >
                  <span className="text-white text-sm">Close</span>
                </button>
              </div>
              
              <img src={selectedNFT.tokenURI} alt={selectedNFT.name} className="w-3/4 h-auto max-h-[40vh] object-contain mx-auto" />
              <div className="mt-6 text-center">
                <h2 className="text-2xl text-center text-white font-medium mb-8">{selectedNFT.name}</h2>
                <a
                  href={`https://worldchain-sepolia.explorer.alchemy.com/token/${contractAddress}/instance/${selectedNFT.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 font-twk-lausanne font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-300"
                >
                  View Onchain
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
