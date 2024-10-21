"use client";
import { signIn, useSession } from "next-auth/react";

export const SignIn = ({ onAddressChange }: { onAddressChange: (address: string | null) => void }) => {
  const { data: session } = useSession();
  
  const buttonStyle = "px-12 py-4 rounded-full text-md font-medium my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black";
  
  

  const handleWorldIDSignIn = async () => {
    await signIn("worldcoin");
  };

  
  return (
    <div className="flex flex-col items-center">
      {session ? (
        <div>
          {/* <button 
            onClick={() => signOut()} 
            className={`${buttonStyle} text-custom-black bg-white hover:bg-custom-hover focus:ring-custom-focus`}
          >
            Sign out 
          </button> */}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <button 
            onClick={handleWorldIDSignIn} 
            className={`${buttonStyle} text-custom-black bg-white hover:bg-custom-hover focus:ring-custom-focus`}
          >
            Sign in with World ID
          </button>
     
        </div>
      )}
    </div>
  );
};
