import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { defineChain } from 'viem';

// Define Coston testnet (Flare Network testnet)
const coston = defineChain({
  id: 16,
  name: 'Coston',
  network: 'coston',
  nativeCurrency: {
    decimals: 18,
    name: 'Coston Flare',
    symbol: 'CFLR',
  },
  rpcUrls: {
    default: {
      http: ['https://coston-api.flare.network/ext/C/rpc'],
    },
    public: {
      http: ['https://coston-api.flare.network/ext/C/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Coston Explorer',
      url: 'https://coston-explorer.flare.network',
    },
  },
  testnet: true,
});

// Define Coston2 testnet (Flare Network testnet)
const coston2 = defineChain({
  id: 114,
  name: 'Coston2',
  network: 'coston2',
  nativeCurrency: {
    decimals: 18,
    name: 'Coston2 Flare',
    symbol: 'C2FLR',
  },
  rpcUrls: {
    default: {
      http: ['https://coston2-api.flare.network/ext/C/rpc'],
    },
    public: {
      http: ['https://coston2-api.flare.network/ext/C/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Coston2 Explorer',
      url: 'https://coston2-explorer.flare.network',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    coston,
    coston2,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});
