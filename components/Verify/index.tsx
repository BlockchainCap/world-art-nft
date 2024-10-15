"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";
import { createPublicClient, http, Chain } from "viem";
import { worldChainSepolia } from "../WorldChainViemClient";



const contractAddress = "0xf97F6E86C537a9e5bE6cdD5E25E6240bA3aE3fC5";


export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel.Device;
};

const verifyPayload: VerifyCommandInput = {
  action: "mint2",
  signal: "",
  verification_level: VerificationLevel.Device,
};

const triggerVerify = () => {
  MiniKit.commands.verify(verifyPayload);
};

interface VerificationDetailsProps {
  details: {
    nullifierHash: string | null;
    merkleRoot: string | null;
    proof: string | null;
    verificationLevel: string | null;
  };
  verifyPayload: VerifyCommandInput;
}

const VerificationDetails: React.FC<VerificationDetailsProps> = ({
  details,
  verifyPayload,
}) => (

  <div className="w-full text-black">
    <h2 className="font-semibold">Verification Details:</h2>
    <p>
      Signal: <code className="break-all">{verifyPayload.signal}</code>
    </p>
    <p>
      Nullifier Hash: <code className="break-all">{details.nullifierHash}</code>
    </p>
    <p>
      Merkle Root: <code className="break-all">{details.merkleRoot}</code>
    </p>
    <p>
      Verification Level: <code>{details.verificationLevel}</code>
    </p>
    <details>
      <summary>Proof</summary>
      <pre className="whitespace-pre-wrap break-all text-xs">
        {details.proof}
      </pre>
    </details>
  </div>
);

export const VerifyBlock = ({
  miniKitAddress,
  onVerificationSuccess,
  isMinting,
}: {
  miniKitAddress: string | null;
  onVerificationSuccess: (nullifierHash: string) => Promise<string | null>;

  isMinting: boolean;
}) => {
  const [verificationDetails, setVerificationDetails] = useState<{
    nullifierHash: string | null;
    merkleRoot: string | null;
    proof: string | null;
    verificationLevel: string | null;
  }>({
    nullifierHash: null,
    merkleRoot: null,
    proof: null,
    verificationLevel: null,
  });
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [mintingProgress, setMintingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<
    "idle" | "verifying" | "generating" | "minting"
  >("idle");


  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppVerifyAction,
      async (response: MiniAppVerifyActionPayload) => {
        if (response.status === "error") {
          setVerificationError("Error in MiniApp verification");
          console.error("Error payload", response);

          if ("error" in response) {
            console.error("Error details:", response.error);
          }
          return;
        }

        const successResponse = response as ISuccessResult;

        try {
          setCurrentStep("verifying");
          setVerificationProgress(50);

          const verifyResponse = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payload: {
                merkle_root: successResponse.merkle_root,
                nullifier_hash: successResponse.nullifier_hash,
                proof: successResponse.proof,
                verification_level: successResponse.verification_level,
              },
              action: verifyPayload.action,
              signal: verifyPayload.signal,
            }),
          });

          setVerificationProgress(100);

          const verifyResponseJson = await verifyResponse.json();
          if (verifyResponseJson.success) {
            console.log("Verification success!");
            console.log(verifyResponseJson);
            setVerificationDetails({
              nullifierHash: successResponse.nullifier_hash,
              merkleRoot: successResponse.merkle_root,
              proof: successResponse.proof,
              verificationLevel: successResponse.verification_level,
            });
            setVerificationError(null);
            setCurrentStep("generating");
            setGenerationProgress(0);
            const imageUrl = await onVerificationSuccess(
              successResponse.nullifier_hash
            );
            if (imageUrl) {
              setGenerationProgress(100);
              setCurrentStep("minting");
              setMintingProgress(0);
              await mintNFT(
                miniKitAddress!,
                successResponse.nullifier_hash,
                imageUrl
              );
              setMintingProgress(100);
              setCurrentStep("idle");
            } else {
              setVerificationError("Failed to generate image");
              setCurrentStep("idle");
            }

          } else {
            setVerificationError(
              verifyResponseJson.error || "Verification failed"
            );
            setVerificationDetails({
              nullifierHash: null,
              merkleRoot: null,
              proof: null,
              verificationLevel: null,
            });
          }
        } catch (error) {
          console.error("Error during verification:", error);
          setVerificationError("An error occurred during verification");
          setVerificationDetails({
            nullifierHash: null,
            merkleRoot: null,
            proof: null,
            verificationLevel: null,
          });
        }
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  const handleVerifyAndMint = () => {
    setCurrentStep("verifying");
    setVerificationProgress(0);
    triggerVerify();
  };

  const mintNFT = async (
    to: string,
    nullifierHash: string,
    tokenURI: string
  ) => {
    try {
      setMintingProgress(25);
      const response = await fetch("/api/mint-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, nullifierHash, tokenURI }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Minting failed:", data.error, data.details);
        throw new Error(`${data.error}: ${data.details}`);
      }

      setMintingProgress(75);
      console.log(
        "NFT minting transaction sent. Transaction hash:",
        data.transactionHash
      );

      // Wait for the transaction to be mined
      const publicClient = createPublicClient({
        chain: worldChainSepolia,
        transport: http(),
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: data.transactionHash,
      });
      console.log("NFT minted successfully. Transaction receipt:", receipt);

      setMintingProgress(100);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setVerificationError(
        error instanceof Error ? error.message : "Error minting NFT"
      );
      setMintingProgress(0);
      setCurrentStep("idle");
    }

  };

  return (
    <div className="max-w-m mx-6 flex flex-col items-center">
      <button
        className={`px-16 py-4 rounded-full text-md font-semibold font-twk-lausanne my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${
          currentStep !== "idle"
            ? "bg-white text-black"
            : "bg-black text-white border-white"
        } focus:ring-white`}
        onClick={handleVerifyAndMint}
        disabled={currentStep !== "idle"}
      >
        <span className={currentStep !== "idle" ? "text-black" : "text-white"}>
          {currentStep === "idle"
            ? "Generate Yours"
            : "Verifying & Generating..."}
        </span>
      </button>
      {/* 
      {currentStep !== 'idle' && (
        <div className="w-full mt-4">
          <div className="mb-2">
            <span className="font-semibold">Verifying: </span>
            <progress value={verificationProgress} max="100" className="w-full" />
          </div>
          <div className="mb-2">
            <span className="font-semibold">Generating: </span>
            <progress value={generationProgress} max="100" className="w-full" />
          </div>
          <div className="mb-2">
            <span className="font-semibold">Minting: </span>
            <progress value={mintingProgress} max="100" className="w-full" />
          </div>
        </div>
      )} */}

      {/* {miniKitAddress && (

        <div className="w-full pt-4 text-black">
          <h2 className="font-semibold">Your Eth Address:</h2>
          <p>
            <code className="break-all">{miniKitAddress}</code>
          </p>
        </div>
      )} */}

      {/* {verificationDetails.nullifierHash && (
        <VerificationDetails details={verificationDetails} verifyPayload={verifyPayload} />
      )} */}
      {verificationError && (
        <p className="text-red-500 max-w-md px-8">Error: {verificationError}</p>

      )}
    </div>
  );
};
