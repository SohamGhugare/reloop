import { Web3 } from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { interfaceToAbi } from "@flarenetwork/flare-periphery-contract-artifacts";

// FtsoV2 address (Flare Testnet Coston2)
// See https://dev.flare.network/ftso/solidity-reference
const FTSOV2_ADDRESS = "0x3d893C53D9e8056135C26C8c638B76C8b60Df726";
const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";
const FEED_IDS = [
  "0x01464c522f55534400000000000000000000000000", // FLR/USD
//   "0x014254432f55534400000000000000000000000000", // BTC/USD
//   "0x014554482f55534400000000000000000000000000", // ETH/USD
];
// ABI for FtsoV2
const abi = interfaceToAbi("FtsoV2Interface", "coston2");

// Define the type for the response from getFeedsById
type GetFeedsByIdResponse = {
  0: string[];
  1: number[];
  2: string;
};

// Type for the price data returned by getFLRUSDPrice
export type PriceData = {
  price: number;
  decimals: number;
  timestamp: string;
  formattedPrice: string;
};

/**
 * Fetches the current FLR/USD price from the FTSO protocol
 * @returns PriceData object containing price information
 */
export async function getFLRUSDPrice(): Promise<PriceData> {
  try {
    // Connect to an RPC node
    const w3 = new Web3(RPC_URL);
    // Set up contract instance
    const ftsov2 = new w3.eth.Contract(abi as AbiItem[], FTSOV2_ADDRESS) as Contract<AbiItem[]>;
    // Fetch current feeds
    const res = await ftsov2.methods.getFeedsById(FEED_IDS).call() as GetFeedsByIdResponse;
    
    // Extract price and decimals - handle BigInt values properly
    const rawPrice = BigInt(res["0"][0]);
    const decimals = Number(res["1"][0]);
    const timestamp = new Date(Number(BigInt(res["2"])) * 1000).toISOString();
    
    // Calculate actual price with decimals - convert BigInt to string first
    const divisor = BigInt(10 ** decimals);
    const priceValue = Number(rawPrice) / Number(divisor);
    
    // Format price to 4 decimal places
    const formattedPrice = priceValue.toFixed(4);
    
    return {
      price: priceValue,
      decimals,
      timestamp,
      formattedPrice
    };
  } catch (error) {
    console.error("Error fetching FLR/USD price:", error);
    // Return a fallback price if there's an error
    return {
      price: 0.0173,
      decimals: 5,
      timestamp: new Date().toISOString(),
      formattedPrice: "0.0173"
    };
  }
}

// Legacy function for backward compatibility
export async function main() {
  const priceData = await getFLRUSDPrice();
  console.log("FLR/USD Price:", priceData.formattedPrice);
  console.log("Timestamp:", priceData.timestamp);
  return priceData;
}