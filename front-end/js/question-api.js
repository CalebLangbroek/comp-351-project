export class QuestionAPI {
    /**
     * @type {string} SERVER_URL URL of the server.
     */
    static SERVER_URL = 'http://localhost:3000/';

    constructor() {}

    getQuestions() {
        return this.sendRequest('GET', 'questions/');
    }

    createQuestion(newQuestion) {
        return this.sendRequest('POST', 'question/', newQuestion);
    }

    updateQuestion(question) {
        return this.sendRequest('PUT', 'question/', question);
    }

    /**
     * Deletes a question from the database.
     *
     * @param {number} id Unique ID of the question to delete.
     */
    deleteQuestion(id) {
        return this.sendRequest('DELETE', 'question/', {
            question: { question_id: id },
        });
    }

    /**
     * Sends an XML HTTP request to the server
     *
     * @param {string} method HTTP method.
     * @param {string} path Path of url
     * @param {any} body Any data to be sent to the server.
     */
    sendRequest(method, path, body = '') {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open(method, QuestionAPI.SERVER_URL + path, true);
            request.setRequestHeader('Content-type', 'application/json');
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        resolve(JSON.parse(request.responseText));
                    } else {
                        // An error occurred
                        reject();
                    }
                }
            };
            request.send(JSON.stringify(body));
        });
    }
}
