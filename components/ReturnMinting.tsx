import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from 'framer-motion';
import { useSession } from "next-auth/react";
import { SignIn } from "./SignIn";
import { createPublicClient, http } from "viem";
import { worldChainSepolia } from "./WorldChainViemClient";
import { worldartABI } from "@/contracts/worldartABI";
import { NFTDetails } from "./NFTDetails";

interface ReturnMintingProps {
  onViewYours: () => void;
  onMenuToggle: () => void;
  setMiniKitAddress: (address: string) => void;
}

export const ReturnMinting: React.FC<ReturnMintingProps> = ({
  onMenuToggle,
  setMiniKitAddress,
}) => {
  const { data: session } = useSession();
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [userNFT, setUserNFT] = useState<{ name: string; tokenURI: string; tokenId: string } | null>(null);
  const [showNFTDetails, setShowNFTDetails] = useState(false);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) {
        const client = createPublicClient({
          chain: worldChainSepolia,
          transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
        });

        try {
          const supply = await client.readContract({
            address: '0x4b8EF28b2e1A8F38e869E530E0AF5f9801a1A91D' as `0x${string}`,
            abi: worldartABI,
            functionName: 'totalSupply',
          }) as bigint;

          setTotalSupply(Number(supply));
        } catch (error) {
          console.error("Error fetching total supply:", error);
        }
      }
    };

    fetchTotalSupply();
  }, []);



  const handleCloseNFTDetails = () => {
    setShowNFTDetails(false);
    setUserNFT(null);
  };

  const handleShare = () => {
    if (userNFT) {
      const tweetText = encodeURIComponent(`Check out my ${userNFT.name} edition from World Art! #UniqueHumans #WorldArt`);
      const tweetUrl = encodeURIComponent(`https://worldchain-sepolia.explorer.alchemy.com/token/0x4b8EF28b2e1A8F38e869E530E0AF5f9801a1A91D/instance/${userNFT.tokenId}`);
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
    }
  };

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

     

      {/* <p className="text-md font-extralight text-center text-custom-black mt-4 mb-2 max-w-xl px-4">
        Thank you for being part of the collection. 
      </p> */}

     {session ? (
       <>
         {showNFTDetails && userNFT ? (
           <NFTDetails
             handleClose={handleCloseNFTDetails}
             handleShare={handleShare}
             nft={userNFT}
           />
         ) : (
           <>
             <Link
               href="/inventory"
               className="px-16 py-4 rounded-full text-md font-medium font-twk-lausanne transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border my-4 border-black text-black bg-white hover:bg-gray-100 focus:ring-black inline-block"
             >
               View Your Edition
             </Link>

             <a
               href="/gallery" 
               target="_blank"
               rel="noopener noreferrer"
               className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black mb-4"
             >
               View Collection Gallery
             </a>
           </>
         )}
       </>
     ) : (
       <SignIn onAddressChange={(address: string | null) => {
         if (address !== null) {
           setMiniKitAddress(address);
         }
       }} />
     )}

<div className="flex items-center my-4 justify-center text-md font-extralight text-center text-custom-black ">
      <span className="font-semibold mr-1">{totalSupply ?? '...'}</span> Unique Humans Collected
      </div>
      <hr className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

       <p className="text-md font-extralight text-center text-custom-black mt-2 max-w-xl px-4 ">
         Unique Humans is a generative portrait collection inspired by
         anonymous proof of human online. Using generative AI and coding,
         unique abstract portrait images are generated on World Chain for a
         limited time and each real human is entitled to one free edition.
       </p>
       <hr className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

       <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black">
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

    </>
  );
};
