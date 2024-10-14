"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel.Device;
};

const verifyPayload: VerifyCommandInput = {
  action: "mint",
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

const VerificationDetails: React.FC<VerificationDetailsProps> = ({ details, verifyPayload }) => (
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
  onVerificationSuccess: (nullifierHash: string) => Promise<void>;
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
          // Log more details about the error
          if ("error" in response) {
            console.error("Error details:", response.error);
          }
          return;
        }

        const successResponse = response as ISuccessResult;

        try {
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
            onVerificationSuccess(successResponse.nullifier_hash);
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

  useEffect(() => {
    console.log("VerifyBlock: miniKitAddress prop changed:", miniKitAddress);
  }, [miniKitAddress]);

  console.log("Current miniKitAddress:", miniKitAddress);

  const handleVerifyAndMint = () => {
    triggerVerify();
  };

  return (
    <div className="max-w-m mx-6 flex flex-col items-center">
      <button
        className={`px-16 py-4 rounded-full text-md font-bold font-twk-lausanne my-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${
          isMinting 
            ? "bg-white text-black" 
            : "bg-black text-white border-white"
        } focus:ring-white`}
        onClick={handleVerifyAndMint}
        disabled={isMinting}
      >
        <span className="text-white">
          {isMinting ? "Verifying & Generating..." : "Generate Yours"}
        </span>
      </button>
      {miniKitAddress && (
        <div className="w-full pt-4 text-black">
          <h2 className="font-semibold">Your Eth Address:</h2>
          <p>
            <code className="break-all">{miniKitAddress}</code>
          </p>
        </div>
      )}

      {verificationDetails.nullifierHash && (
        <VerificationDetails details={verificationDetails} verifyPayload={verifyPayload} />
      )}
      {verificationError && (
        <p className="text-red-500">Error: {verificationError}</p>
      )}
    </div>
  );
};
