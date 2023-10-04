import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  // SimpleNFT合约地址
  const simpleNFTAddress = "0x0fBeFd89C584a30e4840F81fEA56D8187B493260";

  // LotteryManager合约地址
  const lotteryManagerAddress = "0xce617a0Bc3a26A5F880AADEB70A6390CDb8fBfC4";

  // 要传输的NFT的tokenId
  const tokenId = 3; // 例如，传输tokenId为1的NFT

  // 获取SimpleNFT合约的实例
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(simpleNFTAddress);

  // 传输NFT到LotteryManager
  const tx = await simpleNFT
    .connect(signer)
    .safeTransferFrom(signer.address, lotteryManagerAddress, tokenId);
  await tx.wait();

  console.log(`NFT with tokenId ${tokenId} transferred to LotteryManager`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
