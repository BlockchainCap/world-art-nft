import Image from "next/image";
import { saveAs } from 'file-saver';
import React, { useState, useEffect } from 'react';

interface PostMintingProps {
  handleClose: () => void;
  handleSave: () => void;
  handleShare: () => void;
  imageUrl: string;
}

export const PostMinting: React.FC<PostMintingProps> = ({ handleClose, handleSave, handleShare, imageUrl }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  return (
    <>
      <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black">
        World Art
      </h1>
      <button
        onClick={handleClose}
        className="self-end mb-2 px-4 py-2 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 text-black bg-white hover:bg-gray-100 focus:ring-black"
      >
        Close
      </button>
      <div className="w-full max-w-md mb-2 px-4">
        {imgSrc ? (
          <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
            <Image
              src={imgSrc}
              alt="Minted NFT"
              layout="fill"
              objectFit="contain"
              onError={() => setImgSrc('/circle.jpg')}
            />
          </div>
        ) : (
          <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
            <p>Image loading...</p>
          </div>
        )}
      </div>
      <p className="text-xs font-extralight text-center text-custom-black mb-4 max-w-xl px-4">
        Download your piece by long-pressing the image above.
      </p>

      <h2 className="text-2xl font-medium text-center text-custom-black my-2">
        {" "}
        Unique Human #3412
      </h2>

   

      <div className="flex flex-col sm:flex-row gap-4 mt-4">

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
          className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black mb-4"
        >
          View on OpenSea
        </a>
      </div>

      <hr className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

      <p className="text-md font-extralight text-center text-custom-black mt-4 max-w-xl px-4 ">
        Unique Humans is a generative portrait collection inspired by anonymous
        proof of human online. Using generative AI and coding, unique abstract
        portrait images are generated on World Chain for a limited time and each
        real human is entitled to one free edition.
      </p>
      <hr className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

      <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black mt-2">
        <span className="font-extralight">Follow Qian Qian</span>{" "}
        <a
          href="https://www.instagram.com/q2gram"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 font-semibold hover:underline"
        >
          @q2gram
        </a>
      </div>

      <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black mb-[4vh]">
        <span className="font-extralight">Follow Spongenuity</span>{" "}
        <a
          href="https://www.instagram.com/spongenuity"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 font-semibold hover:underline"
        >
          @spongenuity
        </a>
      </div>
    </>
  );
};