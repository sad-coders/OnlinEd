const express = require('express');
const router = express.Router();


const personController = require('./../controller/personController');

router
    .route('/')
    .get(personController.getAllAccounts)
    .post(personController.createAccount) 
router
    .route('/:person_id')
    .put(personController.updatePerson)
    //.get(personController.getPerson)

module.exports = router