import React, { useEffect } from "react";
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

const App = () => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {/* ... */}
        <ConnectKitButton />
        <WalletStatus />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
