import { ethers } from "hardhat";

async function main() {
  // 设置合约地址和网络信息
  const CONTRACT_ADDRESS = "0x0fBeFd89C584a30e4840F81fEA56D8187B493260";

  // 连接到合约
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(CONTRACT_ADDRESS);

  // 设置要铸造的 NFT 的 URI 和接收者地址
  const recipient = "0x3a2963c2E50a7414aAff6B1bb2305DF7629682d6"; // 将此替换为你的钱包地址
  const tokenURI =
    "ipfs://bafkreiayk6phfaq2ema3ndwhdebshfc7h7snet7chrbylk32qmv6t4ytiq"; // 替换为你的 NFT 的 metadata URI

  // 调用 mintNFT 函数
  console.log("Minting NFT...");
  const tx = await simpleNFT.mintNFT(recipient, tokenURI);
  await tx.wait();

  console.log("NFT Minted!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
