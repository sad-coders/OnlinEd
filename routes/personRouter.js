const express = require('express');
const router = express.Router();


const personController = require('./../controller/personController');

router
    .route('/account')
    .get(personController.getAllAccounts)
    .post(personController.createAccount) 
 
module.exports = router