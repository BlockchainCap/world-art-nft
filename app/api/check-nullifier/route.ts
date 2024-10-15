import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { worldChainMainnet } from "@/components/WorldChainViemClient";
import { worldartABI } from "@/contracts/worldartABI";

const contractAddress = "0xb03d978ac6a5b7d565431ef71b80b4191419a627";

export async function POST(req: NextRequest) {
  const { nullifierHash } = await req.json();

  if (!nullifierHash) {
    return NextResponse.json({ error: "Nullifier hash is required" }, { status: 400 });
  }

  try {
    const client = createPublicClient({
      chain: worldChainMainnet,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
    });

    const isUsed = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: worldartABI,
      functionName: 'nullifierHashes',
      args: [nullifierHash],
    }) as boolean;

    return NextResponse.json({ isUsed });
  } catch (error) {
    console.error("Error checking nullifier hash:", error);
    return NextResponse.json({ error: "Failed to check nullifier hash" }, { status: 500 });
  }
}