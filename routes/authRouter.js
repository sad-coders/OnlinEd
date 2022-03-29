const express = require('express');
const router = express.Router();


const authController = require('../controller/authController'); 


router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);

// router.get('/logout', authController.logout);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);
// router.delete('/delete/:user_id', authController.deleteUser);
    