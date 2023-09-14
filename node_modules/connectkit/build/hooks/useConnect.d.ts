/**
 * This is a wrapper around wagmi's useConnect hook that adds some
 * additional functionality.
 */
export declare function useConnect({ ...props }?: {}): {
    data: import("@wagmi/core").ConnectResult<import("@wagmi/core/dist/index-fc9ab085").P<import("viem").Transport<string, Record<string, any>, import("viem").EIP1193RequestFn<undefined>>, import("@wagmi/chains").Chain>> | undefined;
    error: Error | null;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    pendingConnector: import("@wagmi/connectors/dist/base-269cc543").C<any, any> | undefined;
    reset: () => void;
    status: "error" | "success" | "loading" | "idle";
    variables: import("@wagmi/core").ConnectArgs | undefined;
    connect: ({ ...opts }: {
        [x: string]: any;
    }) => void;
    connectAsync: ({ ...opts }: {
        [x: string]: any;
    }) => Promise<import("@wagmi/core").ConnectResult<import("@wagmi/core/dist/index-fc9ab085").P<import("viem").Transport<string, Record<string, any>, import("viem").EIP1193RequestFn<undefined>>, import("@wagmi/chains").Chain>>>;
    connectors: import("@wagmi/connectors/dist/base-269cc543").C<any, any>[];
};
