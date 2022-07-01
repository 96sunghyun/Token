// fs모듈과 ipfs, mongoDB를 이용해 images 폴더에 있는 모든 사진들을 ipfs에 올리고 그에 해당하는 정보들을 넣어주는 함수를 만들자
import fs from "fs";
import mongoose from "mongoose";
import { create } from "ipfs-http-client";
import NFT from "./NFT.js";

const client = create("https://ipfs.infura.io:5001/api/v0");

mongoose
  .connect(
    "mongodb+srv://visioner21:abcdefu@cluster0.it4d3.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(console.log("Connected to MongoDB"))
  .catch((e) => console.error(e));

const saveFiles = async () => {
  //   // images 폴더에 있는 모든 파일 이름을 배열 형식으로 반환한다.
  //   const files = await fs.promises.readdir("./images");
  //   // 반환된 배열의 길이만큼(파일의 숫자만큼) 반복하는 for문 생성
  //   for (let i = 0; i < files.length; i++) {
  //     console.log(`file ${i} working...`);
  //     // 파일을 ipfs에 저장하고 그 url을 imgUrl이라는 변수에 저장한다.
  //     const file = await fs.promises.readFile(`./images/${files[i]}`);
  //     const imgAdded = await client.add(file);
  //     const imgUrl = `http://ipfs.infura.io/ipfs/${imgAdded.path}`;
  //     console.log(`file ${i} is saving...`);
  //     // 새로운 NFT 모델의 객체를 만든다.
  //     // 현재까지 생성된 정보는 token image의 주소값과 file 정보
  //     const nft = new NFT({
  //       tokenUri: imgUrl,
  //       file,
  //     });
  //     await nft.save();
  //   }

  let i = 0;
  const files = await fs.promises.readdir("./images");
  const interval = setInterval(async () => {
    if (i === files.length) {
      clearInterval(interval);
    }
    console.log(`file ${i} working...`);
    // 파일을 ipfs에 저장하고 그 url을 imgUrl이라는 변수에 저장한다.
    const file = await fs.promises.readFile(`./images/${files[i]}`);
    // console.log(file);
    const imgAdded = await client.add(file);
    const imgUrl = `http://ipfs.infura.io/ipfs/${imgAdded.path}`;
    console.log(`file ${i} is saving...`);
    const nft = new NFT({
      tokenUri: imgUrl,
      file,
    });
    await nft.save();
    i++;
  }, 5000 * 2);
};

saveFiles();
