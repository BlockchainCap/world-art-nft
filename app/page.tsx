"use client";


import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { saveAs } from 'file-saver';
import { PreMinting } from "../components/Premint";
import { PostMinting } from "../components/Postmint";
import Link from 'next/link';
import { ReturnMinting } from "../components/ReturnMinting";
import { HamburgerMenu } from "../components/HamburgerMenu";


export default function Home() {
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [hasMintedBefore, setHasMintedBefore] = useState(false);
  const [viewingMinted, setViewingMinted] = useState(false);
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMint = () => {
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      setIsMinted(true);
      setHasMintedBefore(true);
      localStorage.setItem('hasMinted', 'true');
    }, 3000); // 3 seconds delay to simulate minting
  };


  const handleClose = () => {
    setHasMintedBefore(true);
    setViewingMinted(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/UH_rectangle.png');
      const blob = await response.blob();
      saveAs(blob, 'UniqueHuman_3412.png');
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleShare = () => {
    const tweetText = encodeURIComponent("Check out my Unique Human NFT from World Art! #UniqueHumans #WorldArt");
    const tweetUrl = encodeURIComponent("https://world-art-eta.vercel.app/");
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

  return (

    <div className="flex flex-col items-center min-h-screen px-4 relative">
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {isMinting && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-0 flex items-center justify-center z-50">
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
        {isMinted || viewingMinted ? (
          <PostMinting
            handleClose={() => {
              setIsMinted(false);
              setViewingMinted(false);
            }}
            handleSave={handleSave}
            handleShare={handleShare}
          />
        ) : hasMintedBefore ? (
          <ReturnMinting 
            onViewYours={handleViewYours} 
            onMenuToggle={handleMenuToggle}
          />
        ) : (
          <PreMinting
            handleMint={handleMint}
            isMinting={isMinting}
            onMenuToggle={handleMenuToggle}
          />
        )}
      </div>
      {/* {(session && !isMinted && !hasMintedBefore) && (
        <div className="mt-4">
          <button
            onClick={() => signOut()}
            className="px-12 py-4 rounded-full text-md font-medium my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-white focus:ring-black"

          >
            Sign out
          </button>
        </div>
      )} */}

    </div>
  );
}
