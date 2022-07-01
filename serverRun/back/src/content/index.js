import Express from "express";
import * as contentCtrl from "./content.ctrl";
import checkLoggedIn from "../lib/checkLoggedIn";
const content = Express.Router();

content.route("/").post(checkLoggedIn, contentCtrl.write);
content.route("/:contentId").get(contentCtrl.read);
content
  .route("/:contentId")
  .delete(
    checkLoggedIn,
    contentCtrl.getPostById,
    contentCtrl.checkOwnPost,
    contentCtrl.remove
  );
content
  .route("/:contentId")
  .patch(
    checkLoggedIn,
    contentCtrl.getPostById,
    contentCtrl.checkOwnPost,
    contentCtrl.update
  );

export default content;
