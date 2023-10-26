import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

const runApp = async () => {
  try {
    await Moralis.start({
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjU4NDZiMmMxLWY5MWYtNDA5NC1iN2JhLWIzYTMxMWE3N2EwNSIsIm9yZ0lkIjoiMzYyMDM4IiwidXNlcklkIjoiMzcyMDc4IiwidHlwZUlkIjoiNGQ0ODBkNDQtOThlZC00NGY4LWIxMmUtMjYxYjBkNTljMDc1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTgxMjAyMDcsImV4cCI6NDg1Mzg4MDIwN30.Wn8jrHa5oZRYfFmePC8nO0Y9Uq-csfypfxnkgMZGWbM",
    });

    const allNFTs = [];
    const address = "0x3a2963c2E50a7414aAff6B1bb2305DF7629682d6";
    const chains = [EvmChain.SEPOLIA]; // or EvmChain.ETHEREUM for Ethereum mainnet

    for (const chain of chains) {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });
      allNFTs.push(response);
    }

    console.log(allNFTs[0].jsonResponse.result);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
  }
};

runApp();
