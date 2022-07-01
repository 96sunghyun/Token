// 로그인이 되어있는지 확인하는 함수
// 이전에 middleware로 cookie에 token이 있다면 decode해서 req.state로 넘겨줬기 때문에, req.state가 있는지 확인하면 된다.

const checkLoggedIn = (req, res, next) => {
  if (!req.state) {
    return res.status(401).send({ error: "Invalid user" });
  }
  return next();
};

export default checkLoggedIn;
