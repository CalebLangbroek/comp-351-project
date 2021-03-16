import express from 'express';
import { DatabaseUtils } from '../utils/database-utils.js';

const router = express.Router();
const dbUtils = new DatabaseUtils();

// Gets all questions
router.get('/questions', (req, res) => {
    dbUtils.getQuestions().then(data => {
        res.json(data);
    });
});

// Creates new question
router.post('/question', (req, res) => {
    console.log(req.body);

    dbUtils.addQuestion(req.body).then((data) => {
        res.json(data);
    });
});

// Updates question with id
router.put('/question', (req, res) => {
    dbUtils.updateQuestion(req.body).then((data) => {
        res.json(data);
    });
});

// Deletes question with id
router.delete('/question', (req, res) => {
    dbUtils.deleteQuestion(req.body).then((data) => {
        res.json(data);
    });
});

export default router;
