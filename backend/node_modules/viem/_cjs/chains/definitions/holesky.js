"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holesky = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.holesky = (0, chain_js_1.defineChain)({
    id: 17000,
    network: 'holesky',
    name: 'Holesky',
    nativeCurrency: { name: 'Holesky Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.holesky.ethpandaops.io'],
        },
        public: {
            http: ['https://rpc.holesky.ethpandaops.io'],
        },
    },
    contracts: {},
    testnet: true,
});
//# sourceMappingURL=holesky.js.map