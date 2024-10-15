import { Chain } from 'viem/chains'
  export const worldChainMainnet: Chain = {
  id: 480,
  name: 'World Chain',
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
    default: { name: 'Explorer', url: 'https://worldchain-mainnet.explorer.alchemy.com/' },
  },
};
