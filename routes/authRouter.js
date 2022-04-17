const express = require('express');
const router = express.Router();
const authController = require('../controller/authController'); 
const verifyToken = authController.verifyToken

router.route('/login').post(authController.login);
router.route('/protected').get(verifyToken,authController.getProtectedResource);
router.route('/signup').post(authController.signup);
router.route('/verify/:userid').post(authController.verify);

// router.get('/logout', authController.logout);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);
// router.delete('/delete/:user_id', authController.deleteUser);
    
module.exports = router