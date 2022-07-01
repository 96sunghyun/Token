// 기존에 사용했던, 하나의 포스팅마다 하나의 토큰을 보내줬던 방식
import Web3 from "web3";
import HDWalletProvider from "../../node_modules/@truffle/hdwallet-provider/dist/index";
import abi from "../../sol/ERC-20abi";
import User from "../models/user";
import ERC20_ADDRESS from "./ERC20_ADDRESS";
import nodeAddress from "./nodeAddress";

const sendToken = async (userAddr) => {
  const server = await User.findOne({ email: "server" });

  const provider = new HDWalletProvider(server.privateKey, nodeAddress);

  const web3 = new Web3(provider);

  const myContract = new web3.eth.Contract(abi, ERC20_ADDRESS);
  const value = web3.utils.toWei("1");

  const result = await myContract.methods.transfer(userAddr, value).send({
    from: server.address,
    gas: 2000000,
    gasPrice: await web3.eth.getGasPrice(),
  });

  let userAmount = await myContract.methods.balanceOf(userAddr).call();
  userAmount = userAmount / value;

  //   console.log({ result, userAmount });
  return { result, userAmount };
};

export default sendToken;
