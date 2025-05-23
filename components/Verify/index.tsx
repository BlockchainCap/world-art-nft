"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";
import { createPublicClient, http, Chain } from "viem";
import { worldChainMainnet } from "../WorldChainViemClient";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";



const contractAddress = "0xb03d978ac6a5b7d565431ef71b80b4191419a627";


export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel.Device;
};

const verifyPayload: VerifyCommandInput = {
  action: "mint3",
  signal: "",
  verification_level: VerificationLevel.Device,
};

const triggerVerify = () => {
  MiniKit.commands.verify(verifyPayload);
};

interface VerificationDetailsProps {
  details: {
    nullifierHash: string | null;
    merkleRoot: string | null;
    proof: string | null;
    verificationLevel: string | null;
  };
  verifyPayload: VerifyCommandInput;
}

const VerificationDetails: React.FC<VerificationDetailsProps> = ({
  details,
  verifyPayload,
}) => (

  <div className="w-full text-black">
    <h2 className="font-semibold">Verification Details:</h2>
    <p>
      Signal: <code className="break-all">{verifyPayload.signal}</code>
    </p>
    <p>
      Nullifier Hash: <code className="break-all">{details.nullifierHash}</code>
    </p>
    <p>
      Merkle Root: <code className="break-all">{details.merkleRoot}</code>
    </p>
    <p>
      Verification Level: <code>{details.verificationLevel}</code>
    </p>
    <details>
      <summary>Proof</summary>
      <pre className="whitespace-pre-wrap break-all text-xs">
        {details.proof}
      </pre>
    </details>
  </div>
);

export const VerifyBlock = ({
  miniKitAddress,
  onVerificationSuccess,
  isMinting,
}: {
  miniKitAddress: string | null;
  onVerificationSuccess: (nullifierHash: string) => Promise<string | null>;
  isMinting: boolean;
}) => {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGenerateAndMint = async () => {
    if (!session || !session.user || !session.user.name) {
      setError("No valid session found. Please sign in again.");
      return;
    }


    const nullifierHash = session.user.name;

    try {
      // Check if the nullifier hash has already been used
      const isNullifierUsed = await checkNullifierHash(nullifierHash);
      
      if (isNullifierUsed) {
        setError("This account has already claimed an edition.");
        return;
      }

      const imageUrl = await onVerificationSuccess(nullifierHash);
      if (imageUrl) {
        await mintNFT(miniKitAddress!, nullifierHash, imageUrl);
      } else {
        setError("Failed to generate image");
      }
    } catch (error) {
      console.error("Error during generation or minting:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const checkNullifierHash = async (nullifierHash: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/check-nullifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nullifierHash }),
      });

      const data = await response.json();
      return data.isUsed;
    } catch (error) {
      console.error("Error checking nullifier hash:", error);
      throw error;
    }
  };

  const mintNFT = async (to: string, nullifierHash: string, tokenURI: string) => {
    try {
      const response = await fetch("/api/mint-nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, nullifierHash, tokenURI }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`${data.error}: ${data.details}`);
      }

      console.log("NFT minted successfully. Transaction hash:", data.transactionHash);

    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  };

  return (
    <div className="max-w-m mx-6 flex flex-col items-center">
      <button
        className={`px-16 py-4 rounded-full text-md font-semibold font-twk-lausanne my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${
          isMinting
            ? "bg-white text-black"
            : "bg-black text-white border-white"
        } focus:ring-white opacity-0 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : ''
        }`}
        onClick={handleGenerateAndMint}
        disabled={isMinting || !isVisible}

      >
        <span className={isMinting ? "text-black" : "text-white"}>
          {isMinting
            ? "Verifying & Generating..."
            : "Collect Your Edition"}
        </span>
      </button>
      <motion.p 
        className="text-xs font-extralight text-center text-custom-black mt-2 max-w-xl px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        This normally takes ~20 seconds. Try again later if taking longer.
      </motion.p>

      {/* <div className="px-16 py-4 rounded-full text-md font-semibold font-twk-lausanne my-2 text-center">
        <span className="text-black">
          Minting paused due to high traffic. Please check back later.
        </span>
      </div> */}
      {error && (
        <p className="text-red-500 max-w-md px-8">Error: {error}</p>
      )}
    </div>
  );
};
