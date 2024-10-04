"use client";

import Image from "next/image";
import { SignIn } from "@/components/SignIn";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-normal font-twk-lausanne text-center text-custom-white mb-6">World Art</h1>
       
        <div className="w-full max-w-md mb-6 px-4">
          <Image
            src="/UH_rectangle.png" 
            alt="NFT Cover Art"
            width={500}
            height={500}
            className="w-full h-auto object-contain shadow-lg"
          />
        </div>
       
        <h2 className="text-2xl font-semibold text-center text-custom-white mb-4 mt-2">Unique Humans</h2>
        <p className="text-md font-extralight text-center text-custom-white mb-2">
          A collaboration with digital artists:
        </p>
        <p className="text-md font-semibold text-center text-custom-white mb-4">
          Qian Qian + Spongenuity
        </p>
        <SignIn />

    

        <div className="flex items-center justify-center text-md font-extralight text-center text-custom-white my-4">
          <span className="font-semibold mr-1">5555</span> Unique Humans Collected
        </div>

        <hr className=" w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

        <p className="text-md font-extralight text-center text-custom-white mt-4 max-w-xl px-4 ">
          Unique Humans is a generative portrait collection inspired by anonymous proof of human online. Using generative AI and coding, unique abstract portrait images are generated on World Chain for a limited time and each real human is entitled to one free edition.
        </p>
        <hr className=" w-11/12 max-w-md border-t border-custom-white my-4 mx-8" />

        <div className="flex items-center justify-center text-md font-extralight text-center text-custom-white mt-2">
          <span className="font-extralight">Follow Qian Qian</span> <a href="https://www.instagram.com/q2gram" target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold hover:underline">@q2gram</a>
        </div>

        <div className="flex items-center justify-center text-md font-extralight text-center text-custom-white mb-[4vh]">
          <span className="font-extralight">Follow Spongenuity</span> <a href="https://www.instagram.com/spongenuity" target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold hover:underline">@spongenuity</a>
        </div>
      </div>
    </div>
  );
}
