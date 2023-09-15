import { Connector } from 'wagmi';
import { Chain } from 'wagmi/chains';
type DefaultConnectorsProps = {
    chains?: Chain[];
    app: {
        name: string;
        icon?: string;
        description?: string;
        url?: string;
    };
    walletConnectProjectId?: string;
};
declare const defaultConnectors: ({ chains, app, walletConnectProjectId, }: DefaultConnectorsProps) => Connector<any, any>[];
export default defaultConnectors;
