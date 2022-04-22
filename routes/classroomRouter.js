const express = require('express');
const router = express.Router();


const classroomController = require('../controller/classroomController');
// const authController = require('./../controllers/authController');


router
    .route('/')
    //.get(classroomController.getAllClassrooms)
    .get(classroomController.getClassroomsOfPerson)//get request with email query (needs to be modified with token)
    .post(classroomController.createClassroom)
    

router
    .route('/:classroomId')
    .get(classroomController.getClassroom)
    .put(classroomController.updateClassroom)

router
    .route('/:classroomId/addStudents')
    .post(classroomController.addStudentsToClassroom)

module.exports = router;