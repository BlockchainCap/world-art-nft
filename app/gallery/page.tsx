"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPublicClient, http, Chain } from "viem";
import { worldartABI } from "../../contracts/worldartABI";
import { HamburgerMenu } from "../../components/HamburgerMenu";
import { worldChainMainnet } from "@/components/WorldChainViemClient";


const contractAddress = '0xb03d978ac6a5b7d565431ef71b80b4191419a627';

interface NFT {
  id: number;
  name: string;
  artist: string;
  description: string;
  tokenURI: string;
  tokenId: string;
}

export default function Gallery() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchNFTs();
  }, []);

  async function fetchNFTs(forceUpdate = false) {
    try {
      setLoading(true);
      setIsFetching(true);
      const response = await fetch(`/api/cached-nfts${forceUpdate ? '?forceUpdate=true' : ''}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.nfts)) {
        console.log("Received NFTs:", data.nfts);
        setNfts(data.nfts);
      } else {
        console.error("Received data is not an array:", data);
        setNfts([]);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setNfts([]);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }

  const handleManualFetch = () => {
    setIsFetching(true);
    fetchNFTs(true);
  };

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

  const filteredNFTs = nfts.filter(nft => 
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.id.toString().includes(searchTerm)
  );

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
        Gallery
      </h1>
      
      <p className="text-md font-extralight text-center text-custom-black mb-4 max-w-xl px-4">
        View all minted Unique Humans from World Art.
      </p>

      

      <hr className="w-11/12 max-w-md border-t border-custom-white mb-4 mx-8" />

      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* <button
          onClick={handleManualFetch}
          disabled={isFetching}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isFetching ? 'Fetching...' : 'Fetch NFTs'}
        </button> */}
      </div>

      {loading ? (
        <p>Loading Editions...</p>
      ) : (
        <motion.div 
          className="grid grid-cols-2 gap-6 w-full max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredNFTs.map((nft) => (
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
                  href={`https://worldchain-mainnet.explorer.alchemy.com/token/${contractAddress}/instance/${selectedNFT.tokenId}`}
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
