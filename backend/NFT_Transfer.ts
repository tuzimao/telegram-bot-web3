const transferNFT = async (
  NFT_address: string,
  NFT_tokenId: string,
  userAddress: string,
  socket: any
): Promise<void> => {
  // 确保你的 web3 provider 可用
  if (typeof window.ethereum !== "undefined") {
    console.log("transferNFT");

    // 初始化提供者和签名者
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // 创建 NFT 合约实例
    const NFTContract = new ethers.Contract(
      NFT_address,
      [
        // 这里需要添加你的 NFT 合约的 ABI
      ],
      signer
    );

    try {
      // 执行转账操作
      const tx = await NFTContract["transferFrom"](
        userAddress,
        receiverAddress,
        NFT_tokenId
      );
      // 等待交易被确认
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // 发送交易回执到服务器
      if (socket) {
        socket.emit("nftTransferReceipt", {
          receipt,
          chatId: window.location.pathname.split("/")[1],
        });
      }
    } catch (error) {
      console.error("Error transferring NFT:", error);
    }
  } else {
    console.error("Ethereum provider is not available");
  }
};
