import Express from "express";
import Post from "../models/post";
import NFT from "../models/NFT";
const mypage = Express.Router();

// db에서 id owner가 쓴 모든 글을 return해줌
// + owner가 소유하고있는 nft들의 이미지파일을 return 해줌
mypage.route("/").get(async (req, res) => {
  try {
    const userId = req.state.id;
    const list = await Post.find({ "user.id": `${userId}` }).sort({ _id: -1 });
    // owner 보유 NFT 불러오기
    const NFTs = await NFT.find({ ownerAddress: req.state.address });
    // NFT 이미지파일 전송하기
    // const imgFiles = NFTs.map((nft) => Buffer.from(nft.file));
    const imgFiles = NFTs.map((nft) => nft.tokenUri);
    res.status(200);

    return res.send({ list, imgFiles });
    // res.send(list);
  } catch (error) {
    return res.send({ error });
  }
});

export default mypage;
