"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createPublicClient, http, Chain } from "viem";
import { worldartABI } from "../../contracts/worldartABI";
import { MiniKit, ResponseEvent, MiniAppWalletAuthPayload } from "@worldcoin/minikit-js";
import { HamburgerMenu } from "../../components/HamburgerMenu";
import { NFTDetails } from "../../components/NFTDetails";
import { worldChainMainnet } from "@/components/WorldChainViemClient";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const contractAddress = '0xb03d978ac6a5b7d565431ef71b80b4191419a627';

interface NFT {
  id: number;
  name: string;
  artist: string;
  description: string;
  tokenURI: string;
  tokenId: string;
}

function MyNFTsContent() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ReturnType<typeof createPublicClient> | null>(null);
  const [miniKitAddress, setMiniKitAddress] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMinted, setViewMinted] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) {
      const newClient = createPublicClient({
        chain: worldChainMainnet,
        transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
      });
      setClient(newClient);

      // Check for stored wallet address
      const storedAddress = localStorage.getItem('walletAddress');
      if (storedAddress) {
        setMiniKitAddress(storedAddress);
      }
    }

    // Set up MiniKit subscription for wallet auth
    if (MiniKit.isInstalled()) {
      MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, handleWalletAuth);
    }

    return () => {
      if (MiniKit.isInstalled()) {
        MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
      }
    };
  }, []);

  useEffect(() => {
    const viewMintedParam = searchParams.get('viewMinted');
    const addressParam = searchParams.get('address');
    
    if (viewMintedParam === 'true') {
      setViewMinted(true);
      const justMintedNFTString = localStorage.getItem('justMintedNFT');
      if (justMintedNFTString) {
        const justMintedNFT = JSON.parse(justMintedNFTString);
        setNfts(prevNfts => [justMintedNFT, ...prevNfts]);
        setSelectedNFT(justMintedNFT);
        localStorage.removeItem('justMintedNFT');
      }
    }

    if (addressParam) {
      setMiniKitAddress(addressParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (client && miniKitAddress) {
      fetchOwnedNFTs();
    } else if (client && !miniKitAddress && MiniKit.isInstalled()) {
      triggerWalletAuth();
    }
  }, [client, miniKitAddress]);

  const handleWalletAuth = (response: MiniAppWalletAuthPayload) => {
    if (response.status === 'success') {
      setMiniKitAddress(response.address);
      localStorage.setItem('walletAddress', response.address);
    } else {
      console.error('Wallet auth failed:', response);
    }
  };

  const triggerWalletAuth = () => {
    if (MiniKit.isInstalled()) {
      MiniKit.commands.walletAuth({
        nonce: Date.now().toString(),
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: "Sign in with Ethereum to view your NFTs",
      });
    } else {
      console.error('MiniKit is not installed');
    }
  };

  const copyToClipboard = useCallback(() => {
    if (miniKitAddress) {
      navigator.clipboard.writeText(miniKitAddress)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  }, [miniKitAddress]);

  const fetchOwnedNFTs = useCallback(async () => {
    if (!client || !miniKitAddress) return;

    try {
      setLoading(true);

      const ownedTokens = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'getOwnedTokens',
        args: [miniKitAddress as `0x${string}`],
      }) as bigint[];

      const fetchedNFTs = await Promise.all(
        ownedTokens.map(tokenId => fetchNFTData(Number(tokenId)))
      );

      setNfts(fetchedNFTs.filter((nft): nft is NFT => nft !== null));
    } catch (error) {
      console.error("Error fetching owned NFTs:", error);
    } finally {
      setLoading(false);
    }
  }, [client, miniKitAddress]);

  async function fetchNFTData(tokenId: number): Promise<NFT | null> {
    if (!client) return null;

    try {
      const tokenURIData = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'tokenURI',
        args: [BigInt(tokenId)],
      }) as string;

      const decodedData = JSON.parse(atob(tokenURIData.split(',')[1]));

      return {
        id: tokenId,
        name: `Unique Human #${tokenId}`,
        artist: decodedData.artist,
        description: decodedData.description,
        tokenURI: decodedData.image,
        tokenId: tokenId.toString(),
      };
    } catch (error) {
      console.error(`Error fetching NFT data for token ${tokenId}:`, error);
      // Return null for non-existent tokens instead of throwing an error
      return null;
    }
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <button
        onClick={handleMenuToggle}
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
      
      {selectedNFT || (viewMinted && nfts.length > 0) ? (
        <NFTDetails
          handleClose={() => {
            router.push('/');
          }}
          handleShare={() => {
            const nft = selectedNFT || nfts[nfts.length - 1];
            const tweetText = encodeURIComponent(`Check out my ${nft.name} edition from World Art! #UniqueHumans #WorldArt`);
            const tweetUrl = encodeURIComponent(`https://worldchain-mainnet.explorer.alchemy.com/token/${contractAddress}/instance/${nft.tokenId}`);
            window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
          }}
          nft={selectedNFT || nfts[nfts.length - 1]}
        />
      ) : (
        <>
          <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
            My Collection
          </h1>
          
          <p className="text-md font-extralight text-center text-custom-black mb-4 max-w-xl px-4">
            View and manage your collection from World Art.
          </p>

          <hr className="w-11/12 max-w-md border-t border-custom-white mb-6 mt-2 mx-8" />

          {miniKitAddress && (
            <div className="flex items-center mb-6">
              <p className="text-md font-extralight text-center text-custom-black mr-2">
                Address: <code className="break-all font-twk-lausanne">{`${miniKitAddress.slice(0, 6)}...${miniKitAddress.slice(-4)}`}</code>
              </p>
              <button
                onClick={copyToClipboard}
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}

          {loading ? (
            <p></p>
          ) : (
            <motion.div 
              className="grid grid-cols-2 gap-6 w-full max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {nfts.map((nft) => (
                <motion.div
                  key={nft.id}
                  className="bg-white overflow-hidden duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNFT(nft)}
                >
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <img src={nft.tokenURI} alt={nft.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-4">
                    <h2 className="text-md font-semibold mb-2 text-custom-black">{nft.name}</h2>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

export default function MyNFTs() {
  return (
    <Suspense fallback={<div></div>}>
      <MyNFTsContent />
    </Suspense>
  );
}
