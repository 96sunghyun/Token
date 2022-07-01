import mongoose from "mongoose";

const { Schema } = mongoose;

// 스키마 생성
const PostSchema = new Schema({
  title: String,
  body: String,
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    id: mongoose.Types.ObjectId,
    address: String,
    nickName: String,
  },
});

// 모델 생성
const Post = mongoose.model("Post", PostSchema);

export default Post;
