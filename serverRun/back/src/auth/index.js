import Express from "express";
import * as authCtrl from "./auth.ctrl";
const auth = Express.Router();

auth.route("/register").post(authCtrl.register);
auth.route("/login").post(authCtrl.login);
auth.route("/check").get(authCtrl.check);
auth.route("/logout").get(authCtrl.logout);

export default auth;
