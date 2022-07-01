import Post from "../models/post";
import User from "../models/user";
import mongoose from "mongoose";
// 전달받은 요청 내용이 기준에 맞는지 검증하는 라이브러리
import Joi, { string } from "../../node_modules/joi/lib/index";
import sendToken from "../lib/sendToken";
import sendTokens from "../lib/sendTokens";

const { ObjectId } = mongoose.Types;
export const getPostById = async (req, res, next) => {
  // 파라미터로 받은 contentId가 올바른 형식인지 검증하는 함수
  // 파라미터로 contentId를 받는 모든 요청에 적용된다.
  const { contentId } = req.params;

  if (!ObjectId.isValid(contentId)) {
    res.status(400).send({ error: "Invalid Content Id" });
  }
  const post = await Post.findById(contentId);
  if (!post) return res.status(404);

  req.state.post = post;

  return next();
};

export const write = async (req, res) => {
  // 요청받은 data의 형식이 올바른지 Joi 라이브러리를 사용해 검증하는 과정 선행
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(),
    body: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send({ error: result.error });
  }

  // title과 description을 가지고 새로운 게시물을 저장하는 함수
  const { title, body } = req.body;
  // 생성해놓은 Post model 객체를 이용해서 post라는 객체를 생성
  const post = new Post({
    title,
    body,
    // post 객체에 user 정보 포함
    user: {
      id: req.state.id,
      address: req.state.address,
      nickName: req.state.nickName,
    },
  });
  // db에 post 객체를 저장하는 과정
  // 포스트 하나를 보낼 때 토큰 전송 tx를 생성하는 방식에서 포스트 하나를 작성할 때 작성자의 address를 server의 addrList에 넣고
  // addrList의 length가 10이 되면 한번에 토큰을 전송하는 방식으로 바꿔보자
  // 아래에서 주석처리 된 부분은 원래 사용했던 방식
  try {
    // const result = await sendToken(req.state.address);

    // await User.findOneAndUpdate(
    //   {
    //     _id: req.state.id,
    //   },
    //   {
    //     $set: {
    //       tokenAmount: result.userAmount,
    //     },
    //   }
    // );
    // post 작성자의 address를 addrList에 저장하자.
    const server = await User.findOneAndUpdate(
      { email: "server" },
      { $push: { addrList: req.state.address } },
      // new를 true로 설정해주면 업데이트 된 이후 값이 나온다. false일 경우 업데이트 이전 값이 나온다.
      { new: true }
    );
    // addrList.length가 10이 될 때 토큰 전송 함수 실행
    if (server.addrList.length === 10) {
      await sendTokens(server.addrList);
    }
    await post.save();
    res.status(200);
    res.send({
      message: "Saving Successed",
      postId: post._id,
      // data: {
      //   userId: req.state.id,
      //   address: req.state.address,
      //   txHash: result.result.transactionHash,
      //   tokenBalance: result.userAmount,
      // },
    });
  } catch (error) {}
};

export const read = async (req, res) => {
  // contentId를 가지고 해당하는 컨텐츠의 detail을 return하는 함수
  const { contentId } = req.params;
  try {
    const content = await Post.findById(contentId).exec();
    res.json(content);
  } catch (error) {
    res.status(500).send({ error });
  }
};

export const remove = async (req, res) => {
  // contentId를 가지고 해당하는 컨텐츠를 delete 하는 함수
  const { contentId } = req.params;
  try {
    await Post.findByIdAndRemove(contentId).exec();
    return res.send({ status: `Content ${contentId} Remove Success` });
  } catch (error) {
    res.status(500).send({ error });
  }
};

export const update = async (req, res) => {
  // update 시에도 inputType에 대한 검증이 필요하다.
  // 다만 require를 제외한 검증문을 만든다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send({ error: result.error });
  }

  // contentId와 입력받은 title, body를 이용해서 db에 있는 컨텐츠를 업데이트하는 함수
  const { contentId } = req.params;
  try {
    const updated = await Post.findByIdAndUpdate(contentId, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).send({ error });
  }
};

export const checkOwnPost = (req, res, next) => {
  if (req.state.id !== req.state.post.user.id.toString()) {
    return res.status(403).send({ error: "Invalid user" });
  }
  return next();
};
