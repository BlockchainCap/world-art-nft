import { Chain } from 'viem/chains'

export const worldChainSepolia: Chain = {
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
