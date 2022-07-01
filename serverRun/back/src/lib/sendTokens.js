// 토큰을 보내야 할 addrList 배열의 요소 개수가 10개가 되면 한번에 tx를 생성하는 함수

import Web3 from "web3";
import User from "../models/user";
import abi from "../../sol/ERC-20abi";
import ERC20_ADDRESS from "./ERC20_ADDRESS";
import HDWalletProvider from "../../node_modules/@truffle/hdwallet-provider/dist/index";
import nodeAddress from "./nodeAddress";

const contractAddress = ERC20_ADDRESS;

const sendTokens = async (List) => {
  try {
    // transaction이 이루어지기까지는 시간이 걸리기때문에 그 사이에 들어오는 포스팅에 대한 보상 대상 address를 기록해주기위해
    // 함수가 시작되자마자 server계정의 addrList를 비워주도록 한다.
    const server = await User.findOneAndUpdate(
      { email: "server" },
      { addrList: [] },
      { new: true }
    );
    console.log({ nodeAddress });
    const provider = new HDWalletProvider(server.privateKey, nodeAddress);
    const web3 = new Web3(provider);

    // 10개의 요청이 쌓이면 tx를 보내는데, 이 때 최대한 효율을 높이기 위해서 List 배열 내에 같은 address값이 있으면
    // 배열을 그대로 보내는 것이 아니라 두 개의 배열로 나누어 해당 address에 전송할 토큰 amount값을 설정하여 한번의 tx로 줄여준다.
    const addrList = [];
    const amountList = [];

    while (List.length > 0) {
      addrList.push(List[0]);
      // 계정의 NFT 보유 개수를 파악해서 10%씩 토큰을 더 지급하는 효과?
      amountList.push(
        String(List.filter((address) => address === List[0]).length)
      );
      List = List.filter((address, idx) => address !== List[0]);
    }

    // myContract 객체 생성
    const myContract = new web3.eth.Contract(abi, contractAddress);
    // const gasPrice = await web3.eth.getGasPrice();
    console.log("here");
    // tx data생성
    const result = await myContract.methods
      .mintTokens(addrList, amountList)
      .send({
        from: server.address,
        gas: 2000000,
        // gasPrice,
      });

    // const data = myContract.methods
    //   .mintTokens(addrList, amountList)
    //   .encodeABI();
    // // rawTx 생성
    // const rawTx = {
    //   to: contractAddress,
    //   gas: 2000000,
    //   gasPrice,
    //   data,
    // };
    // // rawTx에 sign
    // const signedTx = await web3.eth.accounts.signTransaction(
    //   rawTx,
    //   server.privateKey
    // );
    // // sign이 이루어진 trasaction 전송
    // const result = await web3.eth.sendSignedTransaction(
    //   signedTx.rawTransaction
    // );

    // 계약 전송이 성공했을때만 balanceOf 함수 호출
    if (result.status === true) {
      // addrList에 있는 address들의 토큰 보유량을 업데이트 후 db에 저장
      for (let i = 0; i < addrList.length; i++) {
        let amount = await myContract.methods.balanceOf(addrList[i]).call();
        amount = web3.utils.fromWei(amount);
        await User.findOneAndUpdate(
          { address: addrList[i] },
          { tokenAmount: amount }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export default sendTokens;
