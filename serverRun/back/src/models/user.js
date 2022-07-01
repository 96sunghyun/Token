import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const userSchema = mongoose.Schema({
  // unique 속성을 추가하였더니 같은 값을 넣었을 때 error를 반환하면서 서버가 멈추게 된다.
  // 그러므로 static 함수를 사용하여 중복되는 값을 검사하는 것이 더 나을 것 같다.
  nickName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  privateKey: {
    type: String,
  },
  tokenAmount: {
    type: Number,
  },
  NFTList: [Number],
  addrList: [String],
});

// pre 함수를 선언해주었기때문에 save()메소드가 실행되면 그 전에 pre함수가 실행되고 save된다.
userSchema.pre("save", async function (next) {
  // model에 주어진 객체 그 자체가 this가 된다.
  // password라는 key값의 value가 변경되었는지 확인하는 함수, 아이디 생성시에는 항상 true가 된다.(이전 값이 없기 때문에)
  if (this.isModified("password")) {
    // bcrypt 모듈로 salt값 생성
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } else {
    next();
  }
});

// 입력받은 비밀번호가 올바른지 검사하는 함수
userSchema.methods.comparePassword = async function (plainPassword) {
  const result = await bcrypt.compare(plainPassword, this.password);
  return result; // true / false
};

// res.send()로 address만 보내는 함수
userSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.password;
  delete data.privateKey;
  return data;
};

// JWT 생성 함수
userSchema.methods.generateToken = function () {
  const user = this;
  //jsonwebtoken을 이용해서 token생상하기
  const token = jwt.sign(
    { id: user._id, address: user.address, nickName: user.nickName },
    "6a497cb738ec350fc275baeef13b1c10c950a30a33ac87678ada2a282ce50464660e2a97287bba33073621f14a1449f692fedb3a39a182fbf867ad695a13f414",
    {
      expiresIn: "1d",
    }
  );
  return token;
};

userSchema.statics.findByNickName = async function (nickName) {
  const result = await this.findOne({ nickName });
  return result;
};

userSchema.statics.findByEmail = async function (email) {
  const result = await this.findOne({ email });
  return result;
};

//스키마는 모델로 감싸줘야 함
const User = mongoose.model("User", userSchema); // ("모델이름", 스키마)

export default User;
