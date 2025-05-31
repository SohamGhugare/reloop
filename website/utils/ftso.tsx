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

export async function main() {
  // Connect to an RPC node
  const w3 = new Web3(RPC_URL);
  // Set up contract instance
  const ftsov2 = new w3.eth.Contract(abi as AbiItem[], FTSOV2_ADDRESS) as Contract<AbiItem[]>;
  // Fetch current feeds
  const res = await ftsov2.methods.getFeedsById(FEED_IDS).call() as GetFeedsByIdResponse;
  // Log results
  console.log("Feeds:", res["0"]);
  console.log("Decimals:", res["1"]);
  console.log("Timestamp:", res["2"]);
  return res;
}

main();