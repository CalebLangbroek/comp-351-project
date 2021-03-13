const express = require('express');
const router = express.Router();

const Database = require('../utils/database');

const db = new Database();

// Gets all questions
router.get('/questions', (req, res) => {
    db.sendQuery('SELECT * FROM question;').then(data => {
        res.json(data);
    })
});

// Creates new question
router.post('/question', (req, res) => {

});

// Updates question with id
router.put('/question', (req, res) => {
    
});

// Deletes question with id
router.delete('/question', (req, res) => {

});

module.exports = router;