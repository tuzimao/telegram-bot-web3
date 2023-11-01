import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();

  // SimpleNFT合约地址
  const NFTAddress = "0x0fBeFd89C584a30e4840F81fEA56D8187B493260";

  // LotteryManager合约地址
  const lotteryManagerAddress = "0xdcF6eF9fd2FcfE2125f23F6Fc0280fDfb9F9A819";

  // 要传输的NFT的tokenId
  const tokenId = 6; // 例如，传输tokenId为1的NFT

  // 获取SimpleNFT合约的实例
  const nftContract = await ethers.getContractFactory("ERC721Standard");
  const NFT = nftContract.attach(NFTAddress);

  // 传输NFT到LotteryManager
  const tx = await NFT.connect(signer).safeTransferFrom(
    signer.address,
    lotteryManagerAddress,
    tokenId
  );
  await tx.wait();

  console.log(`NFT with tokenId ${tokenId} transferred to LotteryManager`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
