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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const itemsPerPage = 50;


  useEffect(() => {
    fetchNFTs();
  }, []);

  useEffect(() => {
    if (client) {
      fetchNFTs();
    }
  }, [client, currentPage]);

  async function fetchNFTs() {
    if (!client) return;

    try {
      setLoading(true);

      const supply = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'totalSupply',
      }) as bigint;

      setTotalSupply(Number(supply));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, Number(supply));

      const fetchedNFTs = await Promise.all(
        Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i).map(fetchNFTData)
      );

      const validNFTs = fetchedNFTs.filter((nft): nft is NFT => nft !== null);
      setNfts(validNFTs);
      setFilteredNfts(validNFTs);

    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setNfts([]);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }

  async function fetchNFTData(tokenId: number): Promise<NFT | null> {
    if (!client) return null;

    try {
      const tokenURIData = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'tokenURI',
        args: [BigInt(tokenId)],
      }) as string;

      const decodedData = JSON.parse(atob(tokenURIData.split(',')[1]));

      return {
        id: tokenId,
        name: `Unique Human #${tokenId}`,
        artist: decodedData.artist,
        description: decodedData.description,
        tokenURI: decodedData.image,
        tokenId: tokenId.toString(),
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
      artist: 'Unknown',
      description: 'Error fetching metadata',
      tokenURI: '/logo.jpeg',
      tokenId: tokenId.toString(),
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

  const loadMoreNFTs = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleSearch = async () => {
    if (!client) return;

    if (!searchTerm) {
      // If search term is empty, go back to page 1 and reload
      setCurrentPage(1);
      await fetchNFTs();
      return;
    }

    const tokenId = parseInt(searchTerm);
    if (isNaN(tokenId)) return;

    try {
      setLoading(true);
      if (tokenId >= totalSupply) {
        setFilteredNfts([{
          id: tokenId,
          name: `#${tokenId} Does Not Exist`,
          artist: 'N/A',
          description: 'This edition has not been claimed.',
          tokenURI: '', // No image
          tokenId: tokenId.toString(),
        }]);
      } else {
        const nft = await fetchNFTData(tokenId);
        if (nft) {
          setFilteredNfts([nft]);
        } else {
          setFilteredNfts([]);
        }
      }
    } catch (error) {
      console.error("Error searching for NFT:", error);
      setFilteredNfts([]);
    } finally {
      setLoading(false);
    }
  };

  const Pagination = () => {
    const totalPages = Math.ceil(totalSupply / itemsPerPage);
    const maxVisiblePages = 3;

    const getPageNumbers = () => {
      const pageNumbers = [];
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      return pageNumbers;
    };

    return (
      <nav className="flex justify-center items-center space-x-5 mt-8">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="text-custom-black disabled:text-gray-300 font-twk-lausanne font-medium text-base"
        >
          &lt;&lt;
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="text-custom-black disabled:text-gray-300 font-twk-lausanne font-medium text-base"
        >
          &lt;
        </button>
        {getPageNumbers().map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`font-twk-lausanne font-medium text-base ${
              currentPage === number ? 'text-xl text-custom-black font-semibold' : 'text-custom-black'
            }`}
          >
            {number}
          </button>
        ))}
        {currentPage < totalPages - maxVisiblePages && (
          <>
            <span className="text-custom-black font-twk-lausanne font-medium text-base">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="font-twk-lausanne font-medium text-base text-custom-black"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="text-custom-black disabled:text-gray-300 font-twk-lausanne font-medium text-base"
        >
          &gt;
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="text-custom-black disabled:text-gray-300 font-twk-lausanne font-medium text-base"
        >
          &gt;&gt;
        </button>
      </nav>
    );
  };


  return (
    <div className="flex flex-col items-center min-h-screen px-4 max-w-full overflow-x-hidden">
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

      <div className="flex items-center mb-4 w-full max-w-md">
        <input
          type="number"
          placeholder="Search by token ID..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value === '') {
              handleSearch(); // This will go back to page 1 and reload when the input is cleared
            }
          }}
          className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-custom-black text-white rounded-r-full hover:bg-gray-800 transition-colors font-twk-lausanne border border-custom-black"
        >
          Search
        </button>
      </div>

      <hr className="w-11/12 max-w-md border-t border-custom-white mb-6 mt-2 mx-8" />


      {loading ? (
        <p>Loading Editions...</p>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-2 gap-6 w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredNfts.map((nft) => (
              <motion.div
                key={nft.id}
                className="bg-white overflow-hidden duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => nft.tokenURI ? openModal(nft) : null}
              >
                {nft.tokenURI ? (
                  <>
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img src={nft.tokenURI} alt={nft.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="p-4">
                      <h2 className="text-md font-medium mb-2">{nft.name}</h2>
                    </div>
                  </>
                ) : (
                  <div className="aspect-w-1 aspect-h-1 mb-4 w-full flex items-center justify-center ">
                    <div className="text-center p-4">
                      <h2 className="text-xl font-medium mb-2">{nft.name}</h2>
                      <p className="text-sm text-gray-500">{nft.description}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
          <hr className="w-11/12 max-w-md border-t border-custom-white mt-2 mx-8" />

          <Pagination />
        </>

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
