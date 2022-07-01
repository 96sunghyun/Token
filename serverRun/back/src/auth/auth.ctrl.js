require("dotenv").config();
import Joi, { object } from "../../node_modules/joi/lib/index";
import User from "../models/User";
import lightwallet from "eth-lightwallet";

export const register = async (req, res) => {
  // 회원가입
  // 주어진 양식이 지켜졌는지에 대한 검사
  const schema = Joi.object().keys({
    nickName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send({ err: result.error });
    return;
  }

  // 중복되는 닉네임 / 이메일이 있는지 검사
  const sameNickName = await User.findByNickName(req.body.nickName);
  if (sameNickName) {
    res.status(400).send({ error: "Nickname already exist" });
    return;
  }
  const sameEmail = await User.findByEmail(req.body.email);
  if (sameEmail) {
    res.status(400).send({ error: "Email already exist" });
    return;
  }

  const user = new User({
    nickName: req.body.nickName,
    email: req.body.email,
    password: req.body.password,
  });

  // password는 userSchema 단계에서 pre함수를 설정해줬기때문에 자동으로 hashed 된 값으로 변경된다.
  await user.save();
  // res.json으로 보낼 객체 만들어주기
  // const data = user.toJSON(); // 여기서 다른 방식으로 (Object.assign({}, user) 등) 복사해주면 다른 메타데이터들이 나오는데 왜 그럴까?
  // console.log(await User.findOne({ email: req.body.email }));
  const makePK = function (reqPassword) {
    console.log("making...");
    let mnemonic;
    mnemonic = lightwallet.keystore.generateRandomSeed();
    // 생성된 니모닉코드와 password로 keyStore, address 생성
    lightwallet.keystore.createVault(
      {
        password: reqPassword,
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'",
      },
      function async(err, ks) {
        ks.keyFromPassword(reqPassword, async function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey, 1);
          let address = ks.getAddresses().toString();
          let privateKey = ks.exportPrivateKey(address, pwDerivedKey);

          // 콜백함수 내에서는 this를 인식하지 못하여 불가피하게 저장되어있는 파일을 가져와서 수정해주는 작업을 추가함
          await User.findOneAndUpdate(
            {
              email: req.body.email,
            },
            {
              $set: {
                address: address,
                privateKey: privateKey,
              },
            }
          );

          res.status(200).json({ address });
        });
      }
    );
    // console.log(user);
  };
  makePK(req.body.password);
};

export const login = async (req, res) => {
  // 로그인
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({
      loginSuccess: false,
      message: "제공된 이메일에 해당하는 유저가 없습니다.",
    });
  }
  //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch) {
    return res.json({
      loginSuccess: false,
      message: "비밀번호가 틀립니다.",
    });
  }
  //비밀번호까지 맞다면 유저를 위한 토큰 생성
  const token = user.generateToken();
  if (!token) return res.status(500).send({ error: "Token is not created" });
  //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 세션 등
  //여기서는 쿠키에 저장함 -> npm install cookie-parser --save
  res
    .cookie("x_auth", token, {
      maxAge: 1000 * 60 * 60 * 24, // 1일
      httpOnly: true,
    })
    .status(200)
    .send("Login success");
};

export const check = async (req, res) => {
  const user = req.state;
  if (!user) {
    return res.status(401).end();
  }
  return res.send(user);
};

export const logout = async (req, res) => {
  res.clearCookie("x_auth");
  return res.status(204).send({ status: "logout success" });
};
