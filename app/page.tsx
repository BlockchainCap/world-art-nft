"use client";

import Image from "next/image";
import { SignIn } from "@/components/SignIn";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

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

  if (isMinted) {
    return (
      <div className="flex flex-col items-center min-h-screen px-4 bg-white">
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
          <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black ">
            World Art
          </h1>
          <button
            onClick={handleClose}
            className="self-end mb-2 px-4 py-2 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 text-black bg-white hover:bg-gray-100 focus:ring-black"
          >
            Close
          </button>
          <div className="w-full max-w-md mb-6 px-4">
            <Image
              src="/UH_rectangle.png"
              alt="Minted NFT"
              width={500}
              height={500}
              layout="responsive"
              objectFit="contain"
            />
          </div>

          <h2 className="text-2xl font-medium text-center text-custom-black mb-4 mt-2">
            {" "}
            Unique Human #3412
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => {/* Add save to photos logic */}}
              className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black"
            >
              Save
            </button>
            <button
              onClick={() => {/* Add share on X logic */}}
              className="px-12 py-4 rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black"
            >
              Share on X
            </button>
            <a
              href="https://opensea.io/assets/your-nft-link-here" // Replace with actual OpenSea link
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-4 mb-[4vh] rounded-full text-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-gray-100 focus:ring-black text-center"
            >
              View on OpenSea
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 relative">
      {isMinting && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-25 flex items-center justify-center z-50">
          <svg className="animate-spin h-32 w-32" viewBox="0 0 24 24">
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
        <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
          World Art
        </h1>

        <div className="w-full max-w-md mb-6 px-4">
          <video
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-contain"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-custom-black mb-4 mt-2">
          Unique Humans
        </h2>
        <p className="text-md font-extralight text-center text-custom-black mb-2">
          A collaboration with digital artists:
        </p>
        <p className="text-md font-semibold text-center text-custom-black mb-4">
          Qian Qian + Spongenuity
        </p>
        <SignIn />

        {session && (
          <button
            className="px-12 py-4 rounded-full text-md font-medium font-twk-lausanne my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-white text-white bg-black hover:bg-black focus:ring-white"
            onClick={handleMint}
          >
            Collect
          </button>
        )}

        <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black my-4">
          <span className="font-semibold mr-1">5555</span> Unique Humans
          Collected
        </div>

        <hr className=" w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

        <p className="text-md font-extralight text-center text-custom-black mt-4 max-w-xl px-4 ">
          Unique Humans is a generative portrait collection inspired by
          anonymous proof of human online. Using generative AI and coding,
          unique abstract portrait images are generated on World Chain for a
          limited time and each real human is entitled to one free edition.
        </p>
        <hr className=" w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

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
      </div>
      {session && (
        <div className="mt-4">
          <button
            onClick={() => signOut()}
            className="px-12 py-4 rounded-full text-md  mb-[4vh] font-medium my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black text-black bg-white hover:bg-white focus:ring-black"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
