import React, { useEffect } from "react";
import { sendAddressToServer } from "./api/walletAddressAPI";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { useAccount } from "wagmi";

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
const MyComponent = () => {
  const { address, isConnecting } = useAccount();

  // using useEffect to listen address change
  useEffect(() => {
    if (address) {
      sendAddressToServer(address);
    }
  }, [address]);

  if (isConnecting) return <div>Connecting...</div>;
  if (!address) return <div>Disconnected</div>;
  return <div>Connected Wallet: {address}</div>;
};

const App = () => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {/* ... */}
        <ConnectKitButton />
        <MyComponent />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
