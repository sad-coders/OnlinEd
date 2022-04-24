const express = require("express");
const router = express.Router();

const solutionController = require("../controller/solutionController.js");

router
  .route("/")
  .post(solutionController.insertSolution)
  .delete(solutionController.deleteSolution)
  .put(solutionController.marksForSolution); //marks for soln

router
  .route("/student/:StudentId")
  .get(solutionController.getSolutionByStudentId);

router
  .route("/assignment/:assignmentId")
  .get(solutionController.getSolutionByAssignmentId);

router
  .route("/assignment/:AssignmentId/student/:StudentId")
  .get(solutionController.getSolutionByAssignmentIdAndStudentId);

router
  .route("/getSolutionDetails/:assignmentId/:studentId")
  .get(solutionController.getSubmissionDetails)

module.exports = router;
