import Image from "next/image";
import React, { useState } from 'react';
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
  const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default aspect ratio
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    setAspectRatio(img.naturalWidth / img.naturalHeight);
    setImageLoaded(true);
  };

  const contractAddress = '0xb03d978ac6a5b7d565431ef71b80b4191419a627';
  return (
    <>
      <button
        onClick={handleClose}
        className="self-end mb-4 px-4 pb-4 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 text-gray-600 bg-white hover:bg-gray-100 focus:ring-black"
      >
        Close
      </button>
      
      <motion.div 
        className="w-full max-w-3xl mx-12 mb-6 px-8 sm:px-12 relative"
        style={{ paddingBottom: `${100 / aspectRatio}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 3.5 }}
      >
        <Image
          src={nft.tokenURI}
          alt={nft.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={100}
          priority
          className="object-contain"
          onLoad={handleImageLoad}
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
          href={`https://worldchain-mainnet.explorer.alchemy.com/token/${contractAddress}/instance/${nft.tokenId}`}
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
