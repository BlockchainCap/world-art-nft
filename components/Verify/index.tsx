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

export const VerifyBlock = ({ miniKitAddress }: { miniKitAddress: string | null }) => {
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
  const [verificationError, setVerificationError] = useState<string | null>(null);

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
          if ('error' in response) {
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
          } else {
            setVerificationError(verifyResponseJson.error || "Verification failed");
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

  return (
    <div className="max-w-full overflow-x-auto">
      {miniKitAddress && (
        <div className="mb-4 text-black">
          <h2>Ethereum Address:</h2>
          <p><code className="break-all">{miniKitAddress}</code></p>
        </div>
      )}
      <h1>Verify Block</h1>
      <button className="bg-green-500 p-4" onClick={triggerVerify}>
        Test Verify
      </button>
      {verificationDetails.nullifierHash && (
        <div className="mt-4 text-black max-w-2xl">
          <h2>Verification Details:</h2>
          <p>Signal: <code className="break-all">{verifyPayload.signal}</code></p>
          <p>Nullifier Hash: <code className="break-all">{verificationDetails.nullifierHash}</code></p>
          <p>Merkle Root: <code className="break-all">{verificationDetails.merkleRoot}</code></p>
          <p>Verification Level: <code>{verificationDetails.verificationLevel}</code></p>
          <details>
            <summary>Proof</summary>
            <pre className="whitespace-pre-wrap break-all">{verificationDetails.proof}</pre>
          </details>
        </div>
      )}
      {verificationError && (
        <p className="mt-4 text-red-500">
          Error: {verificationError}
        </p>
      )}
    </div>
  );
};
