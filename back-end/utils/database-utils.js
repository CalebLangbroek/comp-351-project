import { Database } from './database.js';

export class DatabaseUtils {
    constructor() {
        this.db = new Database();
    }

    async getQuestions() {
        const data = await this.db.sendQuery(
            `SELECT q.question_id, q.text AS question_text, c.choice_id, c.text AS choice_text, a.choice_id AS answer_choice_id FROM question q NATURAL JOIN answer a JOIN choice c ON q.question_id = c.question_id`
        );
        return data;
    }

    async addQuestion(data) {
        const questionID = await this.db.sendQuery(
            `INSERT INTO question (text) VALUES (${data.question.text})`
        ).insertId;

        const choiceIDs = [];
        for (let i = 0; i < data.choices; i++) {
            choiceIDs.push(
                await this.db.sendQuery(
                    `INSERT INTO choice (question_id, text, \`index\`) VALUES (${questionID}, ${data.answer.text}, ${i})`
                ).insertId
            );
        }

        const answerID = await this.db.sendQuery(
            `INSERT INTO answer (question_id, choice_id) VALUES (${questionID}, ${
                choiceIDs[data.answer]
            })`
        ).insertId;

        const ids = {
            questionID,
            choiceIDs,
            answerID,
        };

        return ids;
    }

    async updateQuestion(data) {
        await this.db.sendQuery(
            `UPDATE question SET text = ${data.question.text} WHERE question_id = ${data.question.questionID}`
        );

        for (let i = 0; i < data.question.choices; i++) {
            const choice = data.question.choices[i];
            await this.db.sendQuery(
                `UPDATE choice SET text = ${choice.text} WHERE question_id = ${data.question.questionID}`
            );
        }

        await this.db.sendQuery(
            `UPDATE answer SET choice_id = ${data.question.answer.choiceID} WHERE question_id = ${data.question.questionID}`
        );
    }

    async deleteQuestion(data) {
        await this.db.sendQuery(
            `DELETE FROM answer WHERE question_id = ${data.question.questionID}`
        );

        await this.db.sendQuery(
            `DELETE FROM choice WHERE question_id = ${data.question.questionID}`
        );

        await this.db.sendQuery(
            `DELETE FROM question WHERE question_id = ${data.question.questionID}`
        );
    }
}
