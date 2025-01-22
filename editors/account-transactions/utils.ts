import { ethers, BigNumberish } from "ethers";

// Hardcoded provider using Tenderly gateway
const provider = new ethers.JsonRpcProvider();

// Minimal ABI to get token symbol and decimals
const minimalTokenABI = [
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

/**
 * Fetches the token symbol for a given token contract address
 * @param tokenAddress The Ethereum token contract address
 * @returns The token symbol (e.g., "USDT", "DAI")
 */
export async function getTokenSymbol(tokenAddress: string): Promise<string> {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      minimalTokenABI,
      provider,
    );
    const symbol = await tokenContract.symbol();
    return symbol;
  } catch (error) {
    console.error("Error fetching token symbol:", error);
    throw error;
  }
}

/**
 * Converts a big number string to a human-readable format with commas
 * @param amount The amount in string or BigNumber format
 * @param tokenAddress The token contract address to fetch decimals
 * @returns Formatted string with proper decimal places and commas
 */
export function formatTokenAmount(amount: string | BigNumberish): string {
  try {
    // Convert to BigNumber if string
    const amountBN = BigInt(amount);

    // Format the number with proper decimals
    const formattedAmount = ethers.formatUnits(amountBN, 6);

    // Add commas and return
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 6,
    }).format(parseFloat(formattedAmount));
  } catch (error) {
    console.error("Error formatting token amount:", error);
    throw error;
  }
}
