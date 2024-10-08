import Image from "next/image";
import { saveAs } from 'file-saver';
import React from 'react';


interface PostMintingProps {
  handleClose: () => void;
  handleSave: () => void;
  handleShare: () => void;
}

export const PostMinting: React.FC<PostMintingProps> = ({ handleClose, handleSave, handleShare }) => {
  return (
    <>
      <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black ">
        World Art
      </h1>
      <button
        onClick={handleClose}
        className="self-end mb-2 px-4 py-2 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 text-black bg-white hover:bg-gray-100 focus:ring-black"
      >
        Close
      </button>
      <div className="w-full max-w-md mb-6 px-4">
        <Image
          src="/UH_rectangle.png"
          alt="Minted NFT"
          width={500}
          height={500}
          layout="responsive"
          objectFit="contain"
        />
      </div>

      <h2 className="text-2xl font-medium text-center text-custom-black mb-4 mt-4">
        {" "}
        Unique Human #3412
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={handleSave}
          className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black"
        >
          Save
        </button>
        <button
          onClick={handleShare}
          className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black"
        >
          Share on X
        </button>
        <a
          href="https://opensea.io/" 
          target="_blank"
          rel="noopener noreferrer"
          className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black mb-[8vh]"
        >
          View on OpenSea
        </a>
      </div>
    </>
  );
};