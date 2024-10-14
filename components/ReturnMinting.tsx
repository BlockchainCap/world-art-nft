import React from "react";
import Link from "next/link";
import { motion } from 'framer-motion';


interface ReturnMintingProps {
  onViewYours: () => void;
  onMenuToggle: () => void; // Add this prop for menu toggle functionality
}

export const ReturnMinting: React.FC<ReturnMintingProps> = ({
  onViewYours,
  onMenuToggle,
}) => {
  return (
    <>
      <div className="w-full flex items-center justify-center relative mb-4">
        <button
          onClick={onMenuToggle}
          className="absolute pl-4 left-0 pb-4 text-custom-black hover:text-gray-600 transition-colors"
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

        <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black">
          World Art
        </h1>
      </div>

      {/* <p className="text-md font-extralight text-center text-custom-black mb-4 max-w-xl px-4 ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <Link
        href="/inventory"
        className="px-16 py-4 rounded-full text-md font-medium font-twk-lausanne transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border mb-6 bg-white border-black text-black focus:ring-black"
      >
        Your Gallery
      </Link> */}

      {/* <hr className="w-11/12 max-w-md border-t border-custom-white mb-4 mt-2 mx-8" /> */}

      <motion.div 
        className="w-full max-w-md mb-6 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <video
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-contain"
        />
      </motion.div>

      <h2 className="text-2xl font-semibold text-center text-custom-black mb-4 mt-2">
        Unique Humans
      </h2>
      <p className="text-md font-extralight text-center text-custom-black">
        A collaboration with digital artists
      </p>
      <p className="text-md font-semibold text-center text-custom-black mb-4">
        Qian Qian + Spongenuity
      </p>

      <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black ">
        <span className="font-semibold mr-1">5555</span> unique collectors
      </div>

      {/* <p className="text-md font-extralight text-center text-custom-black mt-4 mb-2 max-w-xl px-4">
        Thank you for being part of the collection. 
      </p> */}

      <button
        onClick={onViewYours}
        className="px-16 py-4 rounded-full text-md font-medium font-twk-lausanne transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border my-4 border-black text-black bg-white hover:bg-gray-100 focus:ring-black"
      >
        View Your Edition
      </button>

      <a
          href="/collection/unique-humans" 
          target="_blank"
          rel="noopener noreferrer"
          className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black mb-4"
        >
          View Collection Gallery
        </a>
      <hr className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

       <p className="text-md font-extralight text-center text-custom-black mt-4 max-w-xl px-4 ">
         Unique Humans is a generative portrait collection inspired by
         anonymous proof of human online. Using generative AI and coding,
         unique abstract portrait images are generated on World Chain for a
         limited time and each real human is entitled to one free edition.
       </p>
       <hr className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

       <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black mt-1">
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

       <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black">
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

       <hr className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

       <p className="text-xs font-extralight text-center text-gray-400 mt-2 max-w-xl px-4 ">
       No user or personal data is used to generate the portrait.
       </p>


      {/* <div className="w-full max-w-md my-4 px-4">
        <img src="/cubes.jpg" className="w-full h-auto object-contain" />
      </div>

      <h2 className="text-2xl font-semibold text-center text-custom-black mb-4 mt-2">
        New Drop
      </h2>
      <p className="text-md font-extralight text-center text-custom-black mb-2">
        Featuring digital artist:
      </p>
      <p className="text-md font-semibold text-center text-custom-black mb-2">
        Artist
      </p>

      <p className="text-md font-extralight text-center text-custom-black mb-2 max-w-md px-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

      <button
        onClick={() => {}}
        className="px-16 py-4 rounded-full text-md font-medium font-twk-lausanne transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border my-2 bg-white border-black text-black focus:ring-black mb-[8vh] active:bg-black active:text-white active:border-white"
      >
        Collect
      </button> */}
    </>
  );
};
