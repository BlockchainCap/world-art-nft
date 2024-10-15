import React from "react";
import { SignIn } from "@/components/SignIn";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { VerifyBlock } from "@/components/Verify";
import { useState, useEffect } from "react";
import { WalletSignIn } from "@/components/Wallet";
import { createPublicClient, http } from "viem";
import { worldChainSepolia } from "./WorldChainViemClient";
import { worldartABI } from "@/contracts/worldartABI"; 

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

  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) {
        const client = createPublicClient({
          chain: worldChainSepolia,
          transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
        });

        try {
          const supply = await client.readContract({
            address: '0xf97F6E86C537a9e5bE6cdD5E25E6240bA3aE3fC5' as `0x${string}`,
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
          <SignIn onAddressChange={setMiniKitAddress} />

          <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black my-4">
            <span className="font-semibold mr-1">{totalSupply ?? '...'}</span> Unique Humans Collected

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

      {session && !miniKitAddress && (
        <div className="flex flex-col items-start justify-start mt-[40vh] h-screen">
          <WalletSignIn onAddressChange={(address) => { 
            if (address !== null) {
              setMiniKitAddress(address);
              onAddressChange(address);
            }
          }} />

        </div>
      )}

      {session && miniKitAddress && (
        <div className="flex flex-col items-center justify-start mt-[40vh] h-screen">
          <VerifyBlock 
            miniKitAddress={miniKitAddress} 
            onVerificationSuccess={async (nullifierHash) => {
              return handleMint(nullifierHash);
            }}

            isMinting={isMinting}
          />
        </div>
      )}
    </>
  );
};
