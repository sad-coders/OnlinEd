const express = require("express");
const router = express.Router();

const solutionController = require("../controller/solutionController.js");

router
  .route("/")
  .post(solutionController.insertSolution)
  .delete(solutionController.deleteSolution)
  .put(solutionController.updateSolution);

router
  .route("/student/:StudentId")
  .get(solutionController.getSolutionByStudentId);

router
  .route("/assignment/:AssignmentId")
  .get(solutionController.getSolutionByAssignmentId);

module.exports = router;
