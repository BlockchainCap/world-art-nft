import React from 'react';
import { SignIn } from "@/components/SignIn";
import { useSession } from "next-auth/react";

interface PreMintingProps {
  handleMint: () => void;
  isMinting: boolean;
}

export const PreMinting: React.FC<PreMintingProps> = ({ handleMint, isMinting }) => {
  const { data: session } = useSession();

  return (
    <>
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
          className={`px-16 py-4 rounded-full text-md font-medium font-twk-lausanne my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border ${isMinting ? 'bg-white text-black border-black' : 'bg-black border-white text-white ' } focus:ring-white`}
          onClick={handleMint}
        >
          Collect
        </button>
      )}

      <div className="flex items-center justify-center text-md font-extralight text-center text-custom-black my-4">
        <span className="font-semibold mr-1">5555</span> Unique Humans
        Collected
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
  );
};