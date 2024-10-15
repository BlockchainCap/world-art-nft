"use client";


import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { PreMinting } from "../components/Premint";
import { ReturnMinting } from "../components/ReturnMinting";
import { HamburgerMenu } from "../components/HamburgerMenu";
import { NFTDetails } from "../components/NFTDetails";
import { createPublicClient, http, Chain } from "viem";
import { worldartABI } from "../contracts/worldartABI";
import { worldChainSepolia } from "@/components/WorldChainViemClient";

interface NFT {
  id: number;
  name: string;
  image: string;
  tokenId: string;
  tokenURI: string;
}


const contractAddress = '0x4b8EF28b2e1A8F38e869E530E0AF5f9801a1A91D';

type FetchOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: string;
};

export default function Home() {
  const [isMinting, setIsMinting] = useState(false);
  const [ownedNFT, setOwnedNFT] = useState<NFT | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [client, setClient] = useState<ReturnType<typeof createPublicClient> | null>(null);
  const [miniKitAddress, setMiniKitAddress] = useState<string | null>(null);
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMinted, setIsMinted] = useState(false);
  const [showNFTDetails, setShowNFTDetails] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) {
      const newClient = createPublicClient({
        chain: worldChainSepolia,
        transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
      });
      setClient(newClient);
    }
  }, []);

  useEffect(() => {
    if (client && miniKitAddress && session) {
      checkOwnedNFTs();
    }
  }, [client, miniKitAddress, session]);

  const checkOwnedNFTs = async () => {
    if (!client || !miniKitAddress) return null;

    try {
      const ownedTokens = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'getOwnedTokens',
        args: [miniKitAddress as `0x${string}`],
      }) as bigint[];

      if (ownedTokens.length > 0) {
        const tokenId = Number(ownedTokens[0]);
        const tokenURI = await client.readContract({
          address: contractAddress as `0x${string}`,
          abi: worldartABI,
          functionName: 'tokenURI',
          args: [BigInt(tokenId)],
        }) as string;

        const newNFT = {
          id: tokenId,
          name: `Unique Human #${tokenId}`,
          image: tokenURI,
          tokenId: tokenId.toString(),
          tokenURI: tokenURI,
        };

        setOwnedNFT(newNFT);
        return newNFT;
      }
    } catch (error) {
      console.error("Error checking owned NFTs:", error);
    }
    return null;
  };


  const checkStatus = useCallback(async (taskId: string): Promise<string | null> => {
    console.log(`Checking status for task ID: ${taskId}`);

    try {
      const response = await fetch(`https://dreamlike-portrait-generator-api.onrender.com/api/check_status/${taskId}`, {
        method: 'GET',
      });

      console.log('Status check response:', response);
      console.log('Status check response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Parsed status check data for task ${taskId}:`, data);

      if (data.status === "Success") {
        console.log(`Task ${taskId} completed successfully. Image URL:`, data.result.s3_url);
        setImageUrl(data.result.s3_url);
        setIsMinting(false);
        setIsMinted(true);
        return data.result.s3_url;
      } else if (data.status === "Processing") {
        console.log(`Task ${taskId} still processing. Returning null.`);
        return null;
      } else {
        console.error(`Unexpected status for task ${taskId}:`, data.status);
        setIsMinting(false);
        return null;
      }
    } catch (error) {
      console.error(`Error in checkStatus for task ${taskId}:`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return null;
    }
  }, []);

  const handleMint = async (nullifierHash: string): Promise<string | null> => {
    setIsMinting(true);
    console.log(`Initiating minting process with nullifier hash: ${nullifierHash}`);

    try {
      console.log('Sending request to API...');
      const response = await fetch('https://dreamlike-portrait-generator-api.onrender.com/api/generate_portrait', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seed: nullifierHash }),
      });

      console.log('Response received:', response);
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Parsed data:', data);

      if (data.status === "Processing") {
        console.log(`Portrait generation initiated. Task ID: ${data.task_id}`);
        return new Promise((resolve, reject) => {
          const checkImageStatus = async () => {
            try {
              const imageUrl = await checkStatus(data.task_id);
              if (imageUrl) {
                setIsMinting(false);
                setIsMinted(true);
                // After successful minting:
                const newNFT = await checkOwnedNFTs();
                if (newNFT) {
                  setOwnedNFT(newNFT);
                  setShowNFTDetails(true);
                }
                resolve(imageUrl);
              } else {
                setTimeout(checkImageStatus, 5000); // Check again after 5 seconds
              }
            } catch (error) {
              reject(error);
            }
          };
          checkImageStatus();
        });
      } else {
        console.error('Unexpected response from generate_portrait API:', data);
        setIsMinting(false);
        return null;
      }
    } catch (error) {
      console.error('Error in handleMint:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      setIsMinting(false);
      return null;
    }
  };

  const handleClose = () => {
    setShowNFTDetails(false);
  };

  const handleShare = () => {
    const tweetText = encodeURIComponent(`Check out my ${ownedNFT?.name || 'Unique Human'} edition from World Art! #UniqueHumans #WorldArt`);
    const tweetUrl = encodeURIComponent(`https://worldchain-sepolia.explorer.alchemy.com/token/${contractAddress}/instance/${ownedNFT?.tokenId}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const setMiniKitAddressAsync = async (address: string | null) => {
    setMiniKitAddress(address);
    if (address) {
      await checkOwnedNFTs();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 relative">
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {isMinting && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-0 flex items-start mt-[38vh] justify-center z-50">
          <svg className="animate-spin h-16 w-16" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" style={{ stopColor: "black", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "gray", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "white", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        {showNFTDetails && ownedNFT ? (
          <NFTDetails
            handleClose={handleClose}
            handleShare={handleShare}
            nft={ownedNFT}
          />
        ) : ownedNFT ? (
          <ReturnMinting 
            onViewYours={() => setShowNFTDetails(true)}
            onMenuToggle={handleMenuToggle}
            setMiniKitAddress={setMiniKitAddress}
          />
        ) : (
          <PreMinting
            handleMint={handleMint}
            isMinting={isMinting}
            onMenuToggle={handleMenuToggle}
            onAddressChange={setMiniKitAddressAsync}
            session={session}
          />
        )}
      </div>
    </div>
  );
}
