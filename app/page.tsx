"use client";


import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { PreMinting } from "../components/Premint";
import { ReturnMinting } from "../components/ReturnMinting";
import { HamburgerMenu } from "../components/HamburgerMenu";
import { NFTDetails } from "../components/NFTDetails";
import { createPublicClient, http, Chain } from "viem";
import { worldartABI } from "../contracts/worldartABI";
import { worldChainMainnet } from "@/components/WorldChainViemClient";
import { useRouter } from 'next/navigation';

interface NFT {
  id: number;
  name: string;
  image: string;
  tokenId: string;
  tokenURI: string;
}


const contractAddress = '0xb03d978ac6a5b7d565431ef71b80b4191419a627';

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
  const { data: session, status } = useSession();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMinted, setIsMinted] = useState(false);
  const [hasMintedBefore, setHasMintedBefore] = useState(false);
  const [viewingMinted, setViewingMinted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [justMintedNFT, setJustMintedNFT] = useState<NFT | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) {
      const newClient = createPublicClient({
        chain: worldChainMainnet,
        transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
      });
      setClient(newClient);
    }
  }, []);

  const checkOwnedNFTs = useCallback(async () => {
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
        const tokenURIData = await client.readContract({
          address: contractAddress as `0x${string}`,
          abi: worldartABI,
          functionName: 'tokenURI',
          args: [BigInt(tokenId)],
        }) as string;

        // Decode the base64 encoded JSON data
        const decodedData = JSON.parse(atob(tokenURIData.split(',')[1]));

        const newNFT = {
          id: tokenId,
          name: `Unique Human #${tokenId}`,
          image: decodedData.image,
          tokenId: tokenId.toString(),
          tokenURI: decodedData.image,
        };

        setOwnedNFT(newNFT);
        return newNFT;
      }
    } catch (error) {
      console.error("Error checking owned NFTs:", error);
    }
    return null;
  }, [client, miniKitAddress]);

  useEffect(() => {
    if (client && miniKitAddress) {
      checkOwnedNFTs();
    }
    console.log('ownedNFT', ownedNFT);
    console.log('miniKitAddress', miniKitAddress);
    console.log('session', session);

  }, [client, miniKitAddress, checkOwnedNFTs]);

  useEffect(() => {
    if (status !== 'loading' && (ownedNFT !== undefined)) {
      setIsLoading(false);
    }
  }, [status, ownedNFT]);

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
        setHasMintedBefore(true);
        localStorage.setItem('hasMinted', 'true');
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

  const fetchLatestTokenId = async (): Promise<number | null> => {
    if (!client) return null;

    try {
      const totalSupply = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'totalSupply',
      }) as bigint;

      return Number(totalSupply);
    } catch (error) {
      console.error("Error fetching latest token ID:", error);
    }
    return null;
  };


  

  const handleMint = async (nullifierHash: string): Promise<string | null> => {
    setIsMinting(true);
    console.log(`Minting with nullifier hash: ${nullifierHash}`);

    try {
      const response = await fetch("https://dreamlike-portrait-generator-api.onrender.com/api/generate_portrait", {
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
                
                // Fetch the actual token data from the blockchain
                const tokenId = await fetchLatestTokenId();
                if (tokenId !== null) {
                  const newNFT: NFT = {
                    id: tokenId,
                    name: `Unique Human #${tokenId}`,
                    image: imageUrl,
                    tokenId: tokenId.toString(),
                    tokenURI: imageUrl,
                  };
                  setJustMintedNFT(newNFT);
                  setIsMinted(true);
                  setHasMintedBefore(true);
                  localStorage.setItem('hasMinted', 'true');
                  localStorage.setItem('justMintedNFT', JSON.stringify(newNFT));
                  router.push(`/inventory?viewMinted=true&address=${miniKitAddress}`);
                  resolve(imageUrl);
                } else {
                  console.error('Failed to fetch latest token ID');
                  reject(new Error('Failed to fetch latest token ID'));
                }
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
    setHasMintedBefore(true);
    setViewingMinted(false);
  };



  const handleShare = () => {
    const tweetText = encodeURIComponent(`Check out my ${ownedNFT?.name || 'Unique Human'} edition from World Art! #UniqueHumans #WorldArt`);
    const tweetUrl = encodeURIComponent(`https://worldchain-mainnet.explorer.alchemy.com/token/${contractAddress}/instance/${ownedNFT?.tokenId}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
  };

  const handleViewYours = () => {
    setViewingMinted(true);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewMinted = urlParams.get('viewMinted');
    if (viewMinted === 'true') {
      setViewingMinted(true);
      // Clear the URL parameter
      // window.history.replaceState({}, document.title, window.location.pathname);
      // setIsMinted(true);
    }
  }, []);
  

  if (status === 'loading') {
    return <div></div>;
  }

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
        {!session || (session && !ownedNFT) ? (
          <PreMinting
            handleMint={handleMint}
            isMinting={isMinting}
            onMenuToggle={handleMenuToggle}
            onAddressChange={setMiniKitAddress}
          />
        ) : (
          <ReturnMinting 
            onViewYours={handleViewYours}
            onMenuToggle={handleMenuToggle}
            setMiniKitAddress={setMiniKitAddress}
          />
        )}
      </div>
    </div>
  );
}
