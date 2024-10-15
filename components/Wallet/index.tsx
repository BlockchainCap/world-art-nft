"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { MiniKit, ResponseEvent, MiniAppWalletAuthPayload, MiniAppWalletAuthSuccessPayload } from "@worldcoin/minikit-js";

export const WalletSignIn = ({ onAddressChange }: { onAddressChange: (address: string | null) => void }) => {
  const { data: session } = useSession();
  const [nonce, setNonce] = useState<string | null>(null);
  
  const buttonStyle = "px-12 py-4 rounded-full text-md font-medium my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 border border-black";
  
  useEffect(() => {
    if (!MiniKit.isInstalled()) return;

    const handleWalletAuthResponse = async (payload: MiniAppWalletAuthPayload) => {
      if (payload.status === "error") {
        console.error("Wallet auth error:", payload);
        return;
      }

      const successPayload = payload as MiniAppWalletAuthSuccessPayload;

      try {
        const response = await fetch("/api/complete-siwe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: successPayload,
            nonce: nonce,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isValid) {
            const miniKitAddress = MiniKit.walletAddress;
            console.log("MiniKit wallet address:", miniKitAddress);
            if (miniKitAddress) {
              onAddressChange(miniKitAddress);
            } else {
              console.error("MiniKit wallet address is undefined");
            }
          } else {
            console.error("SIWE verification failed:", data);
          }
        } else {
          console.error("SIWE API call failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error during SIWE verification:", error);
      }
    };

    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, handleWalletAuthResponse);

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
    };
  }, [nonce, onAddressChange]);


  const handleWalletSignIn = async () => {
    try {
      const res = await fetch(`/api/nonce`);
      const { nonce: newNonce } = await res.json();
      setNonce(newNonce);

      MiniKit.commands.walletAuth({
        nonce: newNonce,
        requestId: "0", // Optional
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: "Sign in with Ethereum to World Art",
      });
    } catch (error) {
      console.error("Error initiating wallet auth:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {session ? (
        <div>
         <button 
            onClick={handleWalletSignIn} 
            className={`${buttonStyle} text-custom-black bg-white hover:bg-custom-hover focus:ring-custom-focus`}
          >
            Sign in with Wallet
          </button>
        </div>
      ) : (
        <>

        </>
      )}
    </div>
  );
};
