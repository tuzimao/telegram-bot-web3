import React from "react";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { useAccount } from "wagmi";
import { sendAddressToServer } from "./getWalletAddressAPI";

const config = createConfig(
  getDefaultConfig({
    infuraId: process.env.REACT_APP_INFURA_ID as string,
    walletConnectProjectId: process.env
      .REACT_APP_WALLETCONNECT_PROJECT_ID as string,
    appName: "Telegram-web3",
    appDescription: "Your App Description",
    appUrl: "https://yourappurl.com",
    appIcon: "https://yourappurl.com/logo.png",
  })
);
// for information about user account
const WalletStatus = () => {
  const {
    address: walletAddress,
    isConnecting: walletIsConnecting,
    isDisconnected: walletIsDisconnected,
  } = useAccount();

  React.useEffect(() => {
    if (walletAddress) {
      sendAddressToServer(walletAddress);
    }
  }, [walletAddress]); // eslint-disable-line react-hooks/exhaustive-deps
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
