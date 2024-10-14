"use client";


import { useState, useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { saveAs } from 'file-saver';
import { PreMinting } from "../components/Premint";
import { PostMinting } from "../components/Postmint";
import Link from 'next/link';
import { ReturnMinting } from "../components/ReturnMinting";
import { HamburgerMenu } from "../components/HamburgerMenu";

type FetchOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: string;
};

export default function Home() {
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [hasMintedBefore, setHasMintedBefore] = useState(false);
  const [viewingMinted, setViewingMinted] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const generateRandomSeed = () => Math.floor(Math.random() * 1000000000);

  const checkStatus = useCallback(async (taskId: string) => {
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
      } else if (data.status === "Processing") {
        console.log(`Task ${taskId} still processing. Checking again in 5 seconds.`);
        setTimeout(() => checkStatus(taskId), 5000);
      } else {
        console.error(`Unexpected status for task ${taskId}:`, data.status);
        setIsMinting(false);
      }
    } catch (error) {
      console.error(`Error in checkStatus for task ${taskId}:`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      setTimeout(() => checkStatus(taskId), 5000);
    }
  }, []);

  const handleMint = async () => {
    setIsMinting(true);
    const seed = generateRandomSeed();
    console.log(`Initiating minting process with seed: ${seed}`);

    try {
      console.log('Sending request to API...');
      const response = await fetch('https://dreamlike-portrait-generator-api.onrender.com/api/generate_portrait', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seed }),
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
        checkStatus(data.task_id);
      } else {
        console.error('Unexpected response from generate_portrait API:', data);
        setIsMinting(false);
      }
    } catch (error) {
      console.error('Error in handleMint:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      setIsMinting(false);
    }
  };

  const handleClose = () => {
    setHasMintedBefore(true);
    setViewingMinted(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      saveAs(blob, 'UniqueHuman.png');
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
        {isMinted || viewingMinted ? (
          <PostMinting
            handleClose={() => {
              setIsMinted(false);
              setViewingMinted(false);
            }}
            handleSave={handleSave}
            handleShare={handleShare}
            imageUrl={imageUrl}
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