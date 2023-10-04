import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();
//console.log(process.env);

const REACT_APP_INFURA_ID: string | undefined = process.env.REACT_APP_INFURA_ID;
const PRIVATE_KEY: string | undefined = process.env.PRIVATE_KEY;

//console.log("Infura URL:", REACT_APP_INFURA_ID);
//console.log("Private Key:", PRIVATE_KEY);

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: ``,
      accounts: [``],
    },
  },
};

export default config;
