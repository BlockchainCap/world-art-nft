import React from 'react';
import { SignIn } from "@/components/SignIn";
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';
import { VerifyBlock } from "@/components/Verify";

interface PreMintingProps {
  handleMint: () => Promise<void>;
  isMinting: boolean;
  onMenuToggle: () => void;
}

export const PreMinting: React.FC<PreMintingProps> = ({ handleMint, isMinting,  onMenuToggle,
}) => {
  const { data: session } = useSession();

  return (
    <>
    <button
         onClick={onMenuToggle}
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
   {!session && (
     <>
       
       <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
         World Art
       </h1>
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
       <SignIn />

       <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black my-4">
         <span className="font-semibold mr-1">5555</span> Unique Humans
         Collected
       </div>


       <hr className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

       <p className="text-md font-extralight text-center text-custom-black mt-4 max-w-xl px-4 ">
         Unique Humans is a generative portrait collection inspired by
         anonymous proof of human online. Using generative AI and coding,
         unique abstract portrait images are generated on World Chain for a
         limited time and each real human is entitled to one free edition.
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
     </>
   )}

      {session && (
        <>
        <button
          className={`px-16 py-4 mt-[40vh] rounded-full text-md font-medium font-twk-lausanne my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${isMinting ? 'text-black' : 'bg-black border-white text-white'} focus:ring-white`}
          onClick={handleMint}
          disabled={isMinting}
        >
          {isMinting ? 'Generating...' : 'Generate Yours'}
        </button>

<VerifyBlock />
        </>
      )}
    </>
  );
};
