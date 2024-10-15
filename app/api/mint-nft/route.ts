import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { worldartABI } from '../../../contracts/worldartABI';
import { worldChainSepolia } from '@/components/WorldChainViemClient';


const contractAddress = '0x4b8EF28b2e1A8F38e869E530E0AF5f9801a1A91D';

export async function POST(req: NextRequest) {
  try {
    const { to, nullifierHash, tokenURI } = await req.json();

    console.log("Received minting request:", { to, nullifierHash, tokenURI });

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.error("Private key not found in environment variables");
      return NextResponse.json({ error: "Server configuration error: Missing private key" }, { status: 500 });
    }

    // Ensure the private key is in the correct format
    const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

    const client = createWalletClient({
      chain: worldChainSepolia,
      transport: http()
    });

    try {
      const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);

      console.log("Attempting to mint NFT...");
      const hash = await client.writeContract({
        account,
        address: contractAddress as `0x${string}`,
        abi: worldartABI,
        functionName: 'mint',
        args: [to, BigInt(nullifierHash), tokenURI],
      });

      console.log("NFT minted successfully. Transaction hash:", hash);
      return NextResponse.json({ success: true, transactionHash: hash });
    } catch (error) {
      console.error("Error in writeContract:", error);
      return NextResponse.json({ 
        error: "Contract interaction failed", 
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ 
      error: "Server error", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
