const express = require('express');
const router = express.Router();


const classroomController = require('../controller/classroomController');
// const authController = require('./../controllers/authController');


router
    .route('/')
    .get(classroomController.getAllClassrooms)
    .post(classroomController.insertClassroom)
    

router
    .route('/:classroomId')
    .put(classroomController.updateClassroom)

module.exports = router;