import User from "../models/user";
import NFT from "../models/NFT";
import Web3 from "web3";
import transferToken from "../lib/tranferToken";
import HDWalletProvider from "../../node_modules/@truffle/hdwallet-provider/dist/index";
import NFTabi from "../../sol/ERC-721abi";
import abi from "../../sol/ERC-20abi";

import ERC721_ADDRESS from "../lib/ERC721_ADDRESS";
import ERC20_ADDRESS from "../lib/ERC20_ADDRESS";
import nodeAddress from "../lib/nodeAddress";

export const transfer = async (req, res) => {
  if (!req.state) {
    return res.status(404).send("Invalid Access");
  }
  try {
    const { result, fromAmount, toAmount } = await transferToken(
      req.state.address,
      req.body.toAddr,
      req.body.value
    );
    await User.findOneAndUpdate(
      {
        address: req.state.address,
      },
      {
        $set: {
          tokenAmount: fromAmount,
        },
      }
    );
    await User.findOneAndUpdate(
      {
        address: req.body.toAddr,
      },
      {
        $set: {
          tokenAmount: toAmount,
        },
      }
    );
    const data = {
      txHash: result.transactionHash,
      userId: req.state.id,
      address: req.state.address,
      tokenBalance: fromAmount,
    };
    return res.json({ message: "Transfer Successed", data: data });
  } catch (error) {
    console.log(error);
  }
};

export const count = async (req, res) => {
  const user = await User.findOne({ _id: req.state.id });
  if (!user) {
    return res.status(404).end();
  }
  try {
    return res.send({ amount: user.tokenAmount });
  } catch (error) {
    return res.send({ error });
  }
};

export const buyNFT = async (req, res) => {
  if (!req.state) {
    res.status(400);
    return res.send({ error: "Invalid User" });
  }
  // user 객체, server 객체, nft 객체 불러오기
  try {
    const user = await User.findOne({ address: req.state.address });
    const server = await User.findOne({ email: "server" });
    const NFTs = await NFT.find({ owner: false });
    const nft = NFTs[0];
    // web3 작업을 위한 설정
    const provider = new HDWalletProvider(server.privateKey, nodeAddress);
    const web3 = new Web3(provider);
    const NFTContract = new web3.eth.Contract(NFTabi, ERC721_ADDRESS);
    const FTContract = new web3.eth.Contract(abi, ERC20_ADDRESS);
    const gasPrice = await web3.eth.getGasPrice();

    const result = await NFTContract.methods
      .mintNFT(user.address, nft.tokenUri)
      .send({
        from: server.address,
        gas: 2000000,
        gasPrice,
      });
    console.log(result);
    const tokenId = result.events.Transfer.returnValues.tokenId;
    const ownerAddress = user.address;
    // nft 객체 정보 업데이트
    await nft.updateOne({ tokenId, ownerAddress, owner: true });
    // user 객체 정보 업데이트
    const tokenAmount = await FTContract.methods.balanceOf(user.address).call();

    await user.updateOne({
      tokenAmount: web3.utils.fromWei(tokenAmount),
      $push: { NFTList: tokenId },
    });

    res.status(200);
    return res.send({
      state: "Success",
      data: {
        tokenAmount: web3.utils.fromWei(tokenAmount),
        NFTId: tokenId,
      },
    });
  } catch (error) {
    res.status(403);
    return res.send({ error });
  }
};
