"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { saveAs } from 'file-saver';
import { PreMinting } from "../components/Premint";
import { PostMinting } from "../components/Postmint";

export default function Home() {
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const { data: session } = useSession();

  const handleMint = () => {
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      setIsMinted(true);
    }, 3000); // 3 seconds delay to simulate minting
  };

  const handleClose = () => {
    setIsMinted(false);
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

  return (
    <div className="flex flex-col items-center min-h-screen px-4 relative">
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
        {isMinted ? (
          <PostMinting
            handleClose={handleClose}
            handleSave={handleSave}
            handleShare={handleShare}
          />
        ) : (
          <PreMinting
            handleMint={handleMint}
            isMinting={isMinting}
          />
        )}
      </div>
      {(session && !isMinted) && (
        <div className="mt-4">
          <button
            onClick={() => signOut()}
            className="px-12 py-4 rounded-full text-md font-medium my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-white focus:ring-black"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
