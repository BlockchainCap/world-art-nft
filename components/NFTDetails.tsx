import Image from "next/image";
import React from 'react';
import { motion } from 'framer-motion';

interface NFTDetailsProps {
  handleClose: () => void;
  handleShare: () => void;
  nft: {
    name: string;
    tokenURI: string;
    tokenId: string;
  };
}

export const NFTDetails: React.FC<NFTDetailsProps> = ({ handleClose, handleShare, nft }) => {
const contractAddress = '0xf97F6E86C537a9e5bE6cdD5E25E6240bA3aE3fC5';
  return (
    <>
      <button
        onClick={handleClose}
        className="self-end mb-4 px-4 pb-4 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 text-gray-600 bg-white hover:bg-gray-100 focus:ring-black"
      >
        Close
      </button>
      
      <motion.div 
        className="w-full mb-6 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={nft.tokenURI}
          alt={nft.name}
          width={1920}
          height={1080}
          layout="responsive"
          objectFit="contain"
          className="w-full h-auto object-contain"
        />
      </motion.div>

      <h2 className="text-2xl font-medium text-center text-custom-black my-2">
        {nft.name}
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={handleShare}
          className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black"
        >
          Share on X
        </button>
        <a
          href={`https://worldchain-sepolia.explorer.alchemy.com/token/${contractAddress}/instance/${nft.tokenId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black mb-4"
        >
          View Onchain
        </a>
      </div>
      <p className="text-xs font-extralight text-center text-custom-black my-4 max-w-xl px-4">
        Long-press the image above to download.
      </p>
    </>
  );
};