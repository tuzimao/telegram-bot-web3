const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contractPath = path.resolve("./contracts", "SimpleNFT.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "SimpleNFT.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  // 打印所有编译错误和警告
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
}
fs.writeFileSync(
  "./output/SimpleNFT_ABI.json",

  JSON.stringify(output.contracts["SimpleNFT.sol"].SimpleNFT.abi)
);
