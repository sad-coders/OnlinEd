const express = require("express");
const router = express.Router();
const assignmentController = require('../controller/assignmentController')

router
    .route('/')
    .get(assignmentController.getAllAssignments)
    .post(assignmentController.createAssignment)

module.exports = router


