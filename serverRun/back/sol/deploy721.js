const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const provider = new HDWalletProvider(
  "0d23715630b4a2d7ac82234bcffa82785c6482853c98c6c84329e66cd69616b6",
  "https://rinkeby.infura.io/v3/9e7ae5fb3ff442b0a4ea8e1795b15b10"
);
const web3 = new Web3(provider);
const abi = require("./ERC-721abi");
const bin = require("./ERC-721bin");

const deploy = async () => {
  try {
    const myContract = new web3.eth.Contract(abi);
    const gasPrice = await web3.eth.getGasPrice();
    const recipient = await myContract
      .deploy({
        data: "0x" + bin,
      })
      .send({
        from: "0xc706f1c3c222b2c508f86c012aab7c4e99a58bd9",
        gas: 3000000,
        gasPrice,
      });
    console.log(recipient);
  } catch (e) {
    console.log(e);
  }
};

deploy();
