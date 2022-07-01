import Express from "express";
import * as cryptoCtrl from "./crypto.ctrl";
const crypto = Express.Router();

crypto.route("/transfer").post(cryptoCtrl.transfer);

crypto.route("/count").get(cryptoCtrl.count);

crypto.route("/buyNFT").get(cryptoCtrl.buyNFT);

export default crypto;
