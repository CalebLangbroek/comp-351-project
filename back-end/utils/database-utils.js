const Database = require('./database.js');

class DatabaseUtils {
    constructor() {
        this.db = new Database();
    }

    async getQuestions() {
        const questionsQuery = await this.db.sendQuery(
            `SELECT * FROM question`
        );

        const data = [];

        for (const questionQuery of questionsQuery) {
            const choicesQuery = await this.db.sendQuery(
                `SELECT * FROM choice WHERE question_id = ${questionQuery.question_id}`
            );

            const answerQuery = await this.db.sendQuery(
                `SELECT * FROM answer WHERE question_id = ${questionQuery.question_id} LIMIT 1`
            );

            data.push({
                question: questionQuery,
                choices: choicesQuery,
                answer: answerQuery[0],
            });
        }

        return data;
    }

    async createQuestion(data) {
        const questionQuery = await this.db.sendQuery(
            `INSERT INTO question (text) VALUES ("${data.question.text}")`
        );

        const questionID = questionQuery.insertId;

        const choiceIDs = new Map();
        for (let i = 0; i < data.choices.length; i++) {
            const choiceQuery = await this.db.sendQuery(
                `INSERT INTO choice (question_id, text) VALUES ("${questionID}", "${data.choices[i].text}")`
            );
            choiceIDs.set(data.choices[i].choice_id, choiceQuery.insertId);
        }

        const answerQuery = await this.db.sendQuery(
            `INSERT INTO answer (question_id, choice_id) VALUES ("${questionID}", "${choiceIDs.get(
                data.answer.choice_id
            )}")`
        );
        const answerID = answerQuery.insertId;

        const newQuestion = {
            question: {
                question_id: questionID,
                text: data.question.text,
            },
            choices: [],
            answer: {
                answer_id: answerID,
                question_id: questionID,
                choice_id: choiceIDs.get(data.answer.choice_id),
            },
        };

        for (let i = 0; i < data.choices.length; i++) {
            newQuestion.choices.push({
                question_id: questionID,
                choice_id: choiceIDs.get(data.choices[i].choice_id),
                text: data.choices[i].text,
            });
        }

        return newQuestion;
    }

    async updateQuestion(data) {
        await this.db.sendQuery(
            `UPDATE question SET text = "${data.question.text}" WHERE question_id = "${data.question.question_id}"`
        );

        for (let i = 0; i < data.choices.length; i++) {
            const choice = data.choices[i];
            await this.db.sendQuery(
                `UPDATE choice SET text = "${choice.text}" WHERE choice_id = "${choice.choice_id}"`
            );
        }

        await this.db.sendQuery(
            `UPDATE answer SET choice_id = "${data.answer.choice_id}" WHERE question_id = "${data.question.question_id}"`
        );

        return { success: 1 };
    }

    async deleteQuestion(data) {
        await this.db.sendQuery(
            `DELETE FROM answer WHERE question_id = "${data.question.question_id}"`
        );

        await this.db.sendQuery(
            `DELETE FROM choice WHERE question_id = "${data.question.question_id}"`
        );

        await this.db.sendQuery(
            `DELETE FROM question WHERE question_id = "${data.question.question_id}"`
        );

        return { success: 1 };
    }
}

module.exports = DatabaseUtils;
