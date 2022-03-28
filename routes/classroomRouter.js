const express = require('express');
const router = express.Router();


const classroomController = require('./../controllers/classroomController');
// const authController = require('./../controllers/authController');


router
    .route('/')
    .get(classroomController.getAllClassrooms); 
    

// router
//     .route('/:classroomId')
//     .get(classroomController.getOrderByTableNumber) 
//     .post(classroomController.confirmOrder)  
//     .patch(classroomController.updateOrderByTableNumber)  
//     .delete(classroomController.removeOrderByTableNumber); 

module.exports = router;