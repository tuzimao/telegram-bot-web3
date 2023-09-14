/// <reference types="node" />
import React from 'react';
declare global {
    interface Window {
        trustWallet: any;
        trustwallet: any;
    }
}
declare const truncateEthAddress: (address?: string, separator?: string) => string;
declare const truncateENSAddress: (ensName: string, maxLength: number) => string;
declare const nFormatter: (num: number, digits?: number) => string;
declare const detectBrowser: () => "" | import("detect-browser").Browser | "bot" | "node" | "react-native";
declare const detectOS: () => "" | import("detect-browser").OperatingSystem | NodeJS.Platform;
declare const isAndroid: () => boolean;
declare const isMobile: () => boolean;
declare const getWalletDownloadUri: (connectorId: string) => string;
type ReactChildArray = ReturnType<typeof React.Children.toArray>;
declare function flattenChildren(children: React.ReactNode): ReactChildArray;
export declare const isWalletConnectConnector: (connectorId?: string) => boolean;
export declare const isMetaMaskConnector: (connectorId?: string) => boolean;
export declare const isCoinbaseWalletConnector: (connectorId?: string) => boolean;
export declare const isLedgerConnector: (connectorId?: string) => boolean;
export declare const isSafeConnector: (connectorId?: string) => boolean;
export declare const isInjectedConnector: (connectorId?: string) => boolean;
export { nFormatter, truncateEthAddress, truncateENSAddress, isMobile, isAndroid, detectBrowser, detectOS, getWalletDownloadUri, flattenChildren, };
