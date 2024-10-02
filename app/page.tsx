"use client";

import Image from "next/image";
import { SignIn } from "@/components/SignIn";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start mt-[16vh] p-4 overflow-hidden">
      <h1 className="text-4xl font-bold text-center text-custom-white">Featured Today</h1>
      <div className="mb-4 p-8 max-w-full">
        <Image
          src="/art.svg" 
          alt="NFT Cover Art"
          width={500}
          height={500}
          className="rounded-lg w-full h-auto max-h-[60vh] object-contain"
        />
      </div>
 
      <SignIn />
    </div>
  );
}
