import { QuestionAPI } from './question-api.js';

window.addEventListener('DOMContentLoaded', () => {
    const app = new Student();
    app.init();
});

class Student {
    constructor() {
        this.api = new QuestionAPI();
        this.questions = [];
    }

    init() {
        this.setupEventListeners();
        this.displayQuestions();
    }

    setupEventListeners() {
        document
            .getElementById('submit-test')
            .addEventListener('click', () => this.checkAnswers());
    }

    displayQuestions() {
        this.api.getQuestions().then((questions) => {
            this.questions = questions;
            if (questions.length !== 0) {
                questions.forEach((question) => this.displayQuestion(question));
            } else {
                document.getElementById('alert-no-questions').hidden = false;
                document.getElementById('submit-test').hidden = true;
            }
        });
    }

    displayQuestion(question) {
        let questionsDiv = document.getElementById('questions');
        let div = document.createElement('div');
        div.classList = ['container py-2'];
        div.id = question.question.question_id;

        let innerHTMLString = `
            <div class="row mb-3">
                <div class="col">
                    <h3>Question ${question.question.question_id}</h3>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <h4>${question.question.text}</h4>
                </div>
            </div>
        `;

        for (const choice of question.choices) {
            innerHTMLString += `
                <div class="row mb-3">
                    <div class="col-1">
                        <input
                            type="radio"
                            data-choice-id="${choice.choice_id}"
                            name="choices-${choice.question_id}"
                            class="form-check-input"
                        />
                    </div>
                    <div 
                        class="col choice-text"
                        data-choice-id="${choice.choice_id}"
                    >
                        ${choice.text}
                    </div>
                </div>
            `;
        }

        div.innerHTML = innerHTMLString;
        questionsDiv.appendChild(div);
    }

    checkAnswers() {
        const submitted = [];
        let correct = 0;

        for (const question of this.questions) {
            // Set the correct answer to green
            this.getChoiceTextDivByID(question.answer.choice_id).classList = [
                'col choice-text alert alert-success',
            ];

            const checkedRadio = [
                ...document.querySelectorAll(
                    `[name='choices-${question.question.question_id}'`
                ),
            ].find((radio) => radio.checked);

            // No answer chosen
            if (!checkedRadio) {
                continue;
            }

            const chosenID = Number.parseInt(
                checkedRadio.getAttribute('data-choice-id')
            );

            if (chosenID === question.answer.choice_id) {
                correct++;
            } else {
                this.getChoiceTextDivByID(chosenID).classList = [
                    'col choice-text alert alert-danger',
                ];
            }
        }

        this.printResult(correct, this.questions.length);
    }

    printResult(mark, total) {
        let res = document.getElementById('results');
        res.innerHTML = `
            <div class="col alert alert-primary">
                Final Grade: ${mark} / ${total}
            </div>
        `;
    }

    getChoiceTextDivByID(id) {
        return [
            ...document.querySelectorAll(
                `div.choice-text[data-choice-id='${id}']`
            ),
        ][0];
    }
}
