import React, { useState, useEffect } from "react";
import { SignIn } from "@/components/SignIn";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { VerifyBlock } from "@/components/Verify";
import { WalletSignIn } from "@/components/Wallet";
import { createPublicClient, http } from "viem";
import { worldChainMainnet } from "./WorldChainViemClient";
import { worldartABI } from "@/contracts/worldartABI"; 
import Link from "next/link";
import Image from "next/image";

interface PreMintingProps {
  handleMint: (nullifierHash: string) => Promise<string | null>;
  isMinting: boolean;
  onMenuToggle: () => void;
  onAddressChange: (address: string) => void;
}

export const PreMinting: React.FC<PreMintingProps> = ({
  handleMint,
  isMinting,
  onMenuToggle,
  onAddressChange,
}) => {
  const { data: session } = useSession();
  const [miniKitAddress, setMiniKitAddress] = useState<string | null>(null);
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const buttonStyle = "px-12 py-4 rounded-full text-md font-medium my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black";


  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) {
        const client = createPublicClient({
          chain: worldChainMainnet,
          transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
        });

        try {
          const supply = await client.readContract({
            address: '0xb03d978ac6a5b7d565431ef71b80b4191419a627' as `0x${string}`,
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

  const CountdownTimer: React.FC<{ targetDate: number }> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState<string>("");
  
    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
  
        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft("expired");
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
  
      return () => clearInterval(timer);
    }, [targetDate]);
  
    if (timeLeft === "expired") {
      return (
        <div className="text-red-500 font-semibold text-center my-4">
          The claim window for this collection has closed.
        </div>
      );
    }
  
    return (
      <div className="text-center my-4">
        <p className="font-semibold">Time left to claim: </p>
        <p>{timeLeft}</p>
      </div>
    );
  };

  const fadeInAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 2 }
  };

  return (
    <>
      <motion.button
        {...fadeInAnimation}
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
      </motion.button>
      {!session && (
        <>
          <motion.h1 {...fadeInAnimation} className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
            World Art
          </motion.h1>
          <motion.div {...fadeInAnimation} className="w-full max-w-md mb-6 px-4 relative">
            {!videoLoaded && (
              <Image
                src="/UH_rectangle.png"
                alt="Unique Humans Placeholder"
                width={500}
                height={281}
                layout="responsive"
                className="w-full h-auto object-contain"
              />
            )}
            <video
              src="/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-auto object-contain ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoadedData={() => setVideoLoaded(true)}
            />
          </motion.div>

          <motion.h2 {...fadeInAnimation} className="text-2xl font-semibold text-center text-custom-black mb-4 mt-2">
            Unique Humans
          </motion.h2>
          <motion.p {...fadeInAnimation} className="text-md font-extralight text-center text-custom-black">
            A collaboration with digital artists
          </motion.p>
          <motion.p {...fadeInAnimation} className="text-md font-semibold text-center text-custom-black mb-4">
            Qian Qian + Spongenuity
          </motion.p>
          <motion.div {...fadeInAnimation}>
            <SignIn onAddressChange={setMiniKitAddress} />
          </motion.div>
        
          <motion.div {...fadeInAnimation} className="flex items-center justify-center text-md font-extralight text-center text-custom-black my-2">
            <span className="font-semibold mr-1">{totalSupply ?? '...'}</span> Unique Collectors
          </motion.div>
          <motion.div {...fadeInAnimation}>
            <CountdownTimer targetDate={1729828799000} />
          </motion.div>

          <motion.hr {...fadeInAnimation} className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />


          <motion.p {...fadeInAnimation} className="text-md font-extralight text-center text-custom-black mt-2 max-w-xl px-4 ">
            <strong className="font-semibold">Unique Humans</strong> is a generative portrait collection inspired by
            anonymous proof of human online. Using generative AI and coding,
            unique abstract portrait images are generated on World Chain for a
            limited time and each real human is entitled to one free edition.
          </motion.p>
          <motion.hr {...fadeInAnimation} className="w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

          <motion.div {...fadeInAnimation} className="flex items-center justify-center text-md font-extralight text-center text-custom-black mt-1">
            <span className="font-extralight">Follow Qian Qian</span>{" "}
            <a
              href="https://www.instagram.com/q2gram"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-semibold hover:underline"
            >
              @q2gram
            </a>
          </motion.div>

          <motion.div {...fadeInAnimation} className="flex items-center justify-center text-md font-extralight text-center text-custom-black">
            <span className="font-extralight">Follow Spongenuity</span>{" "}
            <a
              href="https://www.instagram.com/spongenuity"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-semibold hover:underline"
            >
              @spongenuity
            </a>
          </motion.div>
          <motion.hr {...fadeInAnimation} className="w-11/12 max-w-md mt-4 border-t border-custom-white my-4 mx-8" />

          <motion.p {...fadeInAnimation} className="text-xs font-extralight text-center text-gray-400 mt-2 max-w-xl px-4 ">
            No user or personal data is used to generate the portrait.
          </motion.p>
          <motion.p {...fadeInAnimation} className="text-xs font-extralight text-center text-gray-400 mt-3 max-w-xl px-4 ">
            Developed by <a href="https://x.com/zile_cao" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-custom-black">@zile_cao</a> | <a href="https://x.com/blockchaincap" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-custom-black">@blockchaincap</a> 
          </motion.p>
        </>
      )}

      {session && !miniKitAddress && (
        <motion.div {...fadeInAnimation} className="flex flex-col items-start justify-start mt-[40vh] h-screen">
          <WalletSignIn onAddressChange={(address) => { 
            if (address !== null) {
              setMiniKitAddress(address);
              onAddressChange(address);
            }
          }} />
        </motion.div>
      )}

      {session && miniKitAddress && (
        <motion.div {...fadeInAnimation} className="flex flex-col items-center justify-start mt-[40vh] h-screen">
          <VerifyBlock 
            miniKitAddress={miniKitAddress} 
            onVerificationSuccess={async (nullifierHash) => {
              return handleMint(nullifierHash);
            }}
            isMinting={isMinting}
          />
        </motion.div>
      )}
    </>
  );
};