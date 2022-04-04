const express = require('express');
const router = express.Router();


const mailController = require('../controller/mailController'); 


router
    .route('/:mailId')
    .get(mailController.sendMail)
    .post(mailController.sendMail)
    


module.exports = router;