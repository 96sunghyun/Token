import mongoose from "mongoose";

const { Schema } = mongoose;

// 스키마 생성
const NFTSchema = new Schema({
  tokenUri: String,
  file: String,
  tokenId: Number,
  owner: {
    type: Boolean,
    default: false,
  },
  ownerAddress: String,
});

// 모델 생성
const NFT = mongoose.model("NFT", NFTSchema);

export default NFT;
