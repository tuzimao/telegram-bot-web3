"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const walletAddressAPI_1 = require("./api/walletAddressAPI");
const wagmi_1 = require("wagmi");
const connectkit_1 = require("connectkit");
const wagmi_2 = require("wagmi");
const config = (0, wagmi_1.createConfig)((0, connectkit_1.getDefaultConfig)({
    infuraId: process.env.REACT_APP_INFURA_ID,
    walletConnectProjectId: process.env
        .REACT_APP_WALLETCONNECT_PROJECT_ID,
    appName: "Telegram-web3",
    appDescription: "Your App Description",
    appUrl: "https://yourappurl.com",
    appIcon: "https://yourappurl.com/logo.png",
}));
// for information about user account
const MyComponent = () => {
    const { address, isConnecting } = (0, wagmi_2.useAccount)();
    // using useEffect to listen address change
    (0, react_1.useEffect)(() => {
        if (address) {
            (0, walletAddressAPI_1.sendAddressToServer)(address);
        }
    }, [address]);
    if (isConnecting)
        return react_1.default.createElement("div", null, "Connecting...");
    if (!address)
        return react_1.default.createElement("div", null, "Disconnected");
    return react_1.default.createElement("div", null,
        "Connected Wallet: ",
        address);
};
const App = () => {
    return (react_1.default.createElement(wagmi_1.WagmiConfig, { config: config },
        react_1.default.createElement(connectkit_1.ConnectKitProvider, null,
            react_1.default.createElement(connectkit_1.ConnectKitButton, null),
            react_1.default.createElement(MyComponent, null))));
};
exports.default = App;
