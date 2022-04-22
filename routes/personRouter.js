const express = require('express');
const router = express.Router();


const personController = require('./../controller/personController');

router
    .route('/')
    .get(personController.getAllAccounts)
    .post(personController.createAccount) 
    .put(personController.updatePerson)

router
    .route('/:personId')
    .put(personController.addPersonToClassroom)
    //.get(personController.getPerson)

module.exports = router