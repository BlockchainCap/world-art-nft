import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { worldartABI } from '../../../contracts/worldartABI';

const worldChainSepolia: Chain = {
    id: 4801,
    name: 'World Chain Sepolia',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL!],
      },
      public: {
        http: [process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL!],
      },
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'https://worldchain-sepolia.explorer.alchemy.com/' },
    },
  };

const contractAddress = '0xf97F6E86C537a9e5bE6cdD5E25E6240bA3aE3fC5';

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
