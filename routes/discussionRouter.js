const express = require("express");
const router = express.Router();

const discussionController = require("../controller/discussionController.js");

// router
//   .route("/")
//   .get(discussionController.getAlldiscussion)
//   .post(discussionController.insertdiscussion)
//   .delete(discussionController.deletedicussion)
//   .put(discussionController.updatediscussion);

// router.route("/Author/:AuthorId").get(discussionController.getByAuthorId);

// new Routers.
// get all the question of the classroom
router
  .route("/classroom/:classRoomId")
  .get(discussionController.getAllQuestionOfClassRoom)
  .post(discussionController.addQuestion)
  .delete(discussionController.deleteQuestion);

//get all the ans for the question.
router
  .route("/classroom/:classRoomId/question/:questionId")
  .get(discussionController.getAllAnswerOfQuestion)
  .post(discussionController.addAnswer)
  .delete(discussionController.deleteAnswer);

module.exports = router;
