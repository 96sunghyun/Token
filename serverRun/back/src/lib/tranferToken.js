import Web3 from "web3";
import User from "../models/user";
import abi from "../../sol/ERC-20abi";
import ERC20_ADDRESS from "./ERC20_ADDRESS";
import nodeAddress from "./nodeAddress";

const web3 = new Web3(nodeAddress);
const contractAddress = ERC20_ADDRESS;

const transferToken = async (fromAddr, toAddr, value) => {
  const user = await User.findOne({ address: fromAddr });
  const { privateKey } = user;
  const myContract = new web3.eth.Contract(abi, contractAddress);
  value = web3.utils.toWei(value);
  // data에는 contract의 메소드를 사용하는 내용을 담아 encodeABI를 해줘야한다 한다.
  const data = myContract.methods.transfer(toAddr, value).encodeABI();
  // rawTransaction 객체의 to 에는 사용하는 컨트랙트 주소가 들어가야 한다.
  // fromAddr에서 컨트랙트에 tx를 보내고, tx에서 toAddr에게 tx를 보내는 과정을 거치게되기 때문이다.
  const rawTransaction = {
    to: contractAddress,
    gas: 2000000,
    gasPrice: await web3.eth.getGasPrice(),
    data,
  };
  // 생성된 rawTransaction 객체를 sign 해준다.
  const signedTx = await web3.eth.accounts.signTransaction(
    rawTransaction,
    privateKey
  );
  const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  let fromAmount = await myContract.methods.balanceOf(fromAddr).call();
  let toAmount = await myContract.methods.balanceOf(toAddr).call();
  fromAmount = web3.utils.fromWei(fromAmount);
  toAmount = web3.utils.fromWei(toAmount);
  return { result, fromAmount, toAmount };
};

export default transferToken;
