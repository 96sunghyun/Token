require("dotenv").config();
import Express from "express";
import mypage from "./mypage/index";
import content from "./content/index";
import auth from "./auth/index";
import mongoose from "mongoose";
import Post from "./models/post";
import cookieParser from "cookie-parser";
import jwtDecode from "./lib/jwtDecode";
import ethFaucet from "./ethFaucet";
import transfer from "./crypto/index";
import cors from "cors";

const app = new Express();

const { PORT, MONGO_URI } = process.env;

const port = PORT || 4000;

mongoose
  .connect(MONGO_URI)
  .then(console.log("Connected to MongoDB"))
  .catch((e) => console.error(e));

// post 메소드에서 json 형식의 body를 읽어오기위해 필요한 선언!
app.use(Express.json());
// post 메소드에서 x-www-form-urlencoded 형식의 body를 읽어오기 위해 필요한 선언!
app.use(Express.urlencoded({ extended: false }));
// 원래 cookie는 req.headers.cookie에서 확인할 수 있다. 그러나 cookieParser 모듈을 이용하면 req.cookies에서 확인할 수 있게 된다.
app.use(cookieParser());
// req.cookies에 token이 있다면 자동으로 decode 해주는 middleware 추가
app.use(jwtDecode);

// /* CORS 추가 */
let corsOptions = {
  origin: ["http://localhost:3000"],
  credential: true,
};
app.use(cors(corsOptions));

// 메인페이지
app.route("/").get(async (req, res) => {
  // db에 있는 모든 content 불러오는 함수
  try {
    const posts = await Post.find().sort({ _id: -1 }).exec();

    res.json({ post: posts });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// 회원가입, 로그인, 로그아웃, 로그인상태확인 기능 경로
app.use("/auth", auth);

// 마이페이지 경로
app.use("/mypage", mypage);

// 컨텐츠 CRUD 경로
app.use("/content", content);

// fauset route
app.use("/ethFaucet", ethFaucet);

// user의 token 관련 요청 경로
app.use("/crypto", transfer);

app.listen(port, () => {
  console.log(`port 4000 opened...`);
});
