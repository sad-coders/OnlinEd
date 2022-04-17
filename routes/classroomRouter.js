const express = require('express');
const router = express.Router();


const classroomController = require('../controller/classroomController');
// const authController = require('./../controllers/authController');


router
    .route('/')
    //.get(classroomController.getAllClassrooms)
    .get(classroomController.getClassroomsOfPerson)//get request with email query (needs to be modified with token)
    .post(classroomController.insertClassroom)
    

router
    .route('/:classroomId')
    .get(classroomController.getClassroom)
    .put(classroomController.updateClassroom)

module.exports = router;