const express = require("express");
const router = express.Router();

const discussionController = require("../controller/discussionController.js");

router
  .route("/")
  .get(discussionController.getAlldiscussion)
  .post(discussionController.insertdiscussion)
  .delete(discussionController.deletedicussion)
  .put(discussionController.updatediscussion);

router.route("/Author/:AuthorId").get(discussionController.getByAuthorId);

module.exports = router;
