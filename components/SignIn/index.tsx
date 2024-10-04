"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const SignIn = () => {
  const { data: session } = useSession();
  
  const buttonStyle = "px-12 py-4 rounded-full text-md font-medium my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black";
  
  return (
    <div className="flex items-center">
      {session ? (
        <button 
          onClick={() => signOut()} 
          className={`${buttonStyle} text-custom-black bg-white hover:bg-custom-hover focus:ring-custom-focus`}
        >
          Sign out
        </button>
      ) : (
        <button 
          onClick={() => signIn()} 
          className={`${buttonStyle} text-custom-black bg-white hover:bg-custom-hover focus:ring-custom-focus`}
        >
          Sign in to Collect
        </button>
      )}
    </div>
  );
};
