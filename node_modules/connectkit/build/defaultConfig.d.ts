import { Connector, PublicClient, WebSocketPublicClient } from 'wagmi';
import { Chain } from 'wagmi/chains';
export declare const getAppName: () => string;
export declare const getAppIcon: () => string;
type DefaultConfigProps = {
    appName: string;
    appIcon?: string;
    appDescription?: string;
    appUrl?: string;
    autoConnect?: boolean;
    alchemyId?: string;
    infuraId?: string;
    chains?: Chain[];
    connectors?: any;
    publicClient?: any;
    webSocketPublicClient?: any;
    enableWebSocketPublicClient?: boolean;
    stallTimeout?: number;
    walletConnectProjectId: string;
};
declare const defaultConfig: ({ autoConnect, appName, appIcon, appDescription, appUrl, chains, alchemyId, infuraId, connectors, publicClient, stallTimeout, webSocketPublicClient, enableWebSocketPublicClient, walletConnectProjectId, }: DefaultConfigProps) => {
    autoConnect?: boolean | undefined;
    connectors?: Connector<any, any>[] | undefined;
    publicClient: PublicClient;
    webSocketPublicClient?: WebSocketPublicClient<import("viem").Transport<string, Record<string, any>, import("viem").EIP1193RequestFn<undefined>>, Chain> | undefined;
};
export default defaultConfig;
