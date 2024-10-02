"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const SignIn = () => {
  const { data: session } = useSession();
  
  const buttonStyle = "px-8 py-2 rounded-md font-bold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 shadow-lg";
  
  return (
    <div className="flex items-center">
      {session ? (
        <button 
          onClick={() => signOut()} 
          className={`${buttonStyle} text-custom-black bg-custom-white hover:bg-custom-hover focus:ring-custom-focus`}
        >
          Sign out
        </button>
      ) : (
        <button 
          onClick={() => signIn()} 
          className={`${buttonStyle} text-custom-black bg-custom-white hover:bg-custom-hover focus:ring-custom-focus`}
        >
          Sign in to Claim
        </button>
      )}
    </div>
  );
};
