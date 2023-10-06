import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { WagmiConfig, createConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  sepolia,
} from "wagmi/chains";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { useAccount } from "wagmi";
import { sendAddressToServer } from "./getWalletAddressAPI";
import LotteryManagerABI from "./LotteryManagerABI.json";
import io from "socket.io-client";
import { Wallet, ethers } from "ethers";
interface TicketRequest {
  lotteryId: string;
  numberOfTickets: string;
}

const chains = [mainnet, polygon, optimism, arbitrum, goerli, sepolia];

const config = createConfig(
  getDefaultConfig({
    infuraId: process.env.REACT_APP_INFURA_ID as string,
    walletConnectProjectId: process.env
      .REACT_APP_WALLETCONNECT_PROJECT_ID as string,
    chains,
    appName: "Telegram-web3",
    appDescription: "Your App Description",
    appUrl: "https://yourappurl.com",
    appIcon: "https://yourappurl.com/logo.png",
  })
);

// Initialize Web3
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/73d62d6d12454a5d8866f12d641e9dc5"
  )
);
const abi = LotteryManagerABI;

const contractAddress = "0xce617a0Bc3a26A5F880AADEB70A6390CDb8fBfC4";
const contract = new web3.eth.Contract(abi, contractAddress);

const connectToBlockchain = async () => {
  console.log("Attempting to connect to blockchain");
  try {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    console.log(`Connected to account: ${account}`);

    // Calling getOpenLotteries from the contract
    console.log("Attempting to fetch max tickets");
    const maxTickets = await contract.methods.MAX_TICKETS().call();
    console.log("Max Tickets: ", maxTickets);

    console.log("Attempting to fetch open lotteries");
    const openLotteries = await contract.methods
      .getOpenLotteries()
      .call({ from: account });
    console.log("Successfully fetched open lotteries: ", openLotteries);
  } catch (error) {
    console.error("Error connecting to blockchain: ", error);
  }
};

// for information about user account
const WalletStatus = () => {
  const {
    address: walletAddress,
    isConnecting: walletIsConnecting,
    isDisconnected: walletIsDisconnected,
  } = useAccount();
  const chatID = window.location.pathname.split("/")[1];

  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.request({ method: "eth_requestAccounts" });
    }
    connectToBlockchain();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      sendAddressToServer(walletAddress, chatID);
    }
  }, [walletAddress, chatID]);

  if (walletIsConnecting) return <div>Connecting...</div>;
  if (walletIsDisconnected) return <div>Disconnected</div>;
  return <div>Connected Wallet: {walletAddress}</div>;
};

const buyTickets = async (
  lotteryId: number,
  numberOfTickets: number,
  userAddress: string
): Promise<void> => {
  // 确保你的 web3 provider 可用
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // 创建一个新的合约实例
    const lotteryContract = new ethers.Contract(
      contractAddress,
      LotteryManagerABI,
      signer
    ) as ethers.Contract;

    // 计算发送的金额（根据你的合约逻辑，这可能需要更改）
    const bignumberOfTickets = BigInt(numberOfTickets);
    const TICKET_PRICE = ethers.parseEther("0.0001"); // 假设票的价格是 0.0001 ETH
    const totalValue = TICKET_PRICE * bignumberOfTickets;

    try {
      // 调用合约的 buyTickets 函数
      const tx = await lotteryContract.buyTickets(lotteryId, numberOfTickets, {
        value: totalValue,
        from: userAddress,
      });

      // 等待交易被确认
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
    } catch (error) {
      console.error("Error purchasing tickets:", error);
    }
  } else {
    console.error("Ethereum provider is not available");
  }
};

const App = () => {
  const [ticketRequest, setTicketRequest] = useState<TicketRequest | null>(
    null
  );
  useEffect(() => {
    // Connect to the server
    const socket = io("http://localhost:4000");
    const chatID = window.location.pathname.split("/")[1];
    console.log("Emitting setChatId with chatId:", chatID);
    socket.emit("setChatId", chatID);

    // Listen for the buyTicketRequest event from the server
    socket.on("buyTicketRequest", (data) => {
      console.log("Received buyTicketRequest:", data);
      setTicketRequest(data);
    });
    const { address } = useAccount();
    if (address) {
      // 调用 buyTickets 函数执行购买
      await buyTickets(
        parseInt(data.lotteryId),
        parseInt(data.numberOfTickets),
        address
      );
    } else {
      console.error("No connected wallet address found.");
    }
    // Clean up the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {/* ... */}
        <ConnectKitButton />
        <WalletStatus />
        {/* Display the ticket request data if it exists */}
        {ticketRequest && (
          <div>
            <p>Lottery ID: {ticketRequest.lotteryId}</p>
            <p>Number of Tickets: {ticketRequest.numberOfTickets}</p>
          </div>
        )}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
