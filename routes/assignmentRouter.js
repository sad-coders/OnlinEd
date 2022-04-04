const express = require("express");
const router = express.Router();
const assignmentController = require('../controller/assignmentController')

router
    .route('/')
    .get(assignmentController.getAllAssignments)
    .post(assignmentController.createAssignment)
    
router
    .route('/:assignment_id')
    .get(assignmentController.getAssignment)
    .put(assignmentController.updateAssignment)
    .delete(assignmentController.deleteAssignment)
module.exports = router


