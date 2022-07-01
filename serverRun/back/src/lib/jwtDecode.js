import jwt from "jsonwebtoken";

const jwtDecode = async (req, res, next) => {
  const token = req.cookies.x_auth;

  // CORS 설정
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Credentials', true);

  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.state = decoded;
    return next();
  } catch (error) {
    console.log(error);
  }
};

export default jwtDecode;
