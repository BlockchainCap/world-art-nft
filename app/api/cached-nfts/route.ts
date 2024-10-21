import { NextResponse, NextRequest } from 'next/server';
import { createPublicClient, http } from 'viem';
import { worldChainMainnet } from '@/components/WorldChainViemClient';
import { worldartABI } from '@/contracts/worldartABI';
import fs from 'fs/promises';
import path from 'path';

const contractAddress = '0xb03d978ac6a5b7d565431ef71b80b4191419a627';
const CACHE_FILE = path.join(process.cwd(), 'nft-cache.json');
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchNFTData(client: ReturnType<typeof createPublicClient>, tokenId: number) {
  try {
    const tokenURIData = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: worldartABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    }) as string;

    const decodedData = JSON.parse(atob(tokenURIData.split(',')[1]));

    return {
      id: tokenId,
      name: `Unique Human #${tokenId}`,
      artist: decodedData.artist,
      description: decodedData.description,
      tokenURI: decodedData.image,
      tokenId: tokenId.toString(),
    };
  } catch (error) {
    console.error(`Error fetching NFT data for token ${tokenId}:`, error);
    return null;
  }
}

async function updateCache() {
  const client = createPublicClient({
    chain: worldChainMainnet,
    transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
  });

  const totalSupply = await client.readContract({
    address: contractAddress as `0x${string}`,
    abi: worldartABI,
    functionName: 'totalSupply',
  }) as bigint;

  const batchSize = 50;  // TODO: modify here based on Alchemy rate limit
  const delay = 10000;    

  const nfts = [];
  for (let i = 0; i < Number(totalSupply); i += batchSize) {
    const batch = await Promise.all(
      Array.from({ length: Math.min(batchSize, Number(totalSupply) - i) }, (_, j) => fetchNFTData(client, i + j))
    );
    nfts.push(...batch);
    console.log(`Fetched NFTs ${i} to ${Math.min(i + batchSize - 1, Number(totalSupply) - 1)}`);
    if (i + batchSize < Number(totalSupply)) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  const filteredNFTs = nfts.filter(nft => nft !== null);

  // Sort NFTs by their ID to ensure they're in the correct order
  filteredNFTs.sort((a, b) => a.id - b.id);

  await fs.writeFile(CACHE_FILE, JSON.stringify({
    lastUpdated: Date.now(),
    nfts: filteredNFTs,
  }));

  console.log(`Updated cache with ${filteredNFTs.length} NFTs`);
}

export async function GET(request: NextRequest) {
  const forceUpdate = request.nextUrl.searchParams.get('forceUpdate') === 'true';

  try {
    if (!forceUpdate) {
      const cacheData = await fs.readFile(CACHE_FILE, 'utf-8');
      const { lastUpdated, nfts } = JSON.parse(cacheData);

      if (Date.now() - lastUpdated <= CACHE_DURATION) {
        return NextResponse.json({ nfts });
      }
    }

    // Cache is outdated or force update is requested, update it
    await updateCache();
    
    // Read the updated cache and return the NFTs
    const updatedCacheData = await fs.readFile(CACHE_FILE, 'utf-8');
    const { nfts } = JSON.parse(updatedCacheData);
    
    return NextResponse.json({ nfts });
  } catch (error) {
    console.error("Error reading or updating cache file:", error);
    return NextResponse.json({ nfts: [] }, { status: 500 });
  }
}
