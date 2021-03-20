import { QuestionAPI } from './question-api.js';

window.addEventListener('DOMContentLoaded', () => {
    const app = new Admin();
    app.init();
});

class Admin {
    constructor() {
        this.api = new QuestionAPI();
        this.choiceCount = 4;
    }

    init() {
        this.setupEventListeners();
        this.displayQuestions();
    }

    setupEventListeners() {
        document
            .getElementById('add-question')
            .addEventListener('click', this.onAddQuestion.bind(this));

        document
            .getElementById('add-choice')
            .addEventListener('click', this.onAddChoice.bind(this));

        for (let i = 0; i < this.choiceCount; i++) {
            document
                .getElementById(`delete-option-new-${i}`)
                .addEventListener('click', this.onDeleteChoice.bind(this, i));
        }
    }

    displayQuestions() {
        this.api.getQuestions().then((questions) => {
            questions.forEach((question) => this.displayQuestion(question));
        });
    }

    displayQuestion(question) {
        const div = document.createElement('div');
        div.classList = ['py-2'];
        div.id = `question-${question.question.question_id}`;

        let innerHTMLString = `
            <div class="row mb-3">
                <div class="col">
                    <h3>Question ${question.question.question_id}</h3>
                </div>
            </div>
            <div 
                id="alert-empty-fields-${question.question.question_id}"
                class="alert alert-danger"
                role="alert" hidden>
                All fields must be filled out!
            </div>
            <div class="row mb-3">
                <div class="col">
                    <textarea 
                    id="question-text-${question.question.question_id}" 
                    class="form-control">${question.question.text}</textarea>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <h3>Question ${question.question.question_id} Choices</h3>
                </div>
            </div>
        `;

        for (const choice of question.choices) {
            innerHTMLString += `
                <div class="row mb-3" id="choice-${choice.choice_id}">
                    <div class="col-1">
                        <input
                            type="radio"
                            name="choices-${choice.question_id}"
                            data-choice-id="${choice.choice_id}"
                            class="form-check-input"
                            ${
                                question.answer.choice_id === choice.choice_id
                                    ? 'checked'
                                    : ''
                            }
                        />
                    </div>
                    <div class="col">
                        <input type="text"
                        data-question-choice="${choice.question_id}"
                        data-choice-id="${choice.choice_id}"
                        value="${choice.text}" class="form-control" />
                    </div>
                </div>
           `;
        }

        innerHTMLString += `
            <div class="row">
                <div class="col d-flex justify-content-between">
                    <button
                        type="button"
                        id="save-question-${question.question.question_id}"
                        class="btn btn-primary"
                    >
                        Save Question
                    </button>
                    <button
                        type="button"
                        id="delete-question-${question.question.question_id}"
                        class="btn btn-danger"
                    >
                        Delete Question
                    </button>
                </div>
            </div>
        `;
        div.innerHTML = innerHTMLString;
        document.getElementById('questions').appendChild(div);

        document
            .getElementById(`delete-question-${question.question.question_id}`)
            .addEventListener(
                'click',
                this.onDeleteQuestion.bind(this, question.question.question_id)
            );
        document
            .getElementById(`save-question-${question.question.question_id}`)
            .addEventListener(
                'click',
                this.onSaveQuestion.bind(this, question.question.question_id)
            );
    }

    onAddQuestion() {
        this.onSaveQuestion('new').then((newQuestion) => {
            if (newQuestion) {
                this.displayQuestion(newQuestion);

                // Clear the fields
                document.getElementById(`question-text-new`).value = '';
                [
                    ...document.querySelectorAll(
                        `[data-question-choice='new']`
                    ),
                ].forEach((option) => {
                    option.value = '';
                });
            }
        });
    }

    /**
     *
     * @param {*} id
     */
    onSaveQuestion(id) {
        const questionParentDiv = document.querySelector(`#question-${id}`);
        const questionText = questionParentDiv.querySelector(
            `#question-text-${id}`
        ).value;

        const choices = [
            ...questionParentDiv.querySelectorAll(
                `[data-question-choice='${id}']`
            ),
        ];

        const checkedRadio = [
            ...questionParentDiv.querySelectorAll(`[name='choices-${id}'`),
        ].find((radio) => radio.checked);

        if (
            !questionText ||
            choices.some((option) => !option.value) ||
            !checkedRadio
        ) {
            document.getElementById(`alert-empty-fields-${id}`).hidden = false;
            return;
        }

        const answerChoiceID = checkedRadio.getAttribute('data-choice-id');

        // Make sure alert is hidden
        document.getElementById(`alert-empty-fields-${id}`).hidden = true;

        const question = {
            question: {
                question_id: id,
                text: questionText,
            },
            choices: [],
            answer: {
                choice_id: answerChoiceID,
            },
        };

        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            question.choices.push({
                choice_id: choice.getAttribute('data-choice-id'),
                text: choice.value,
            });
        }

        if (id === 'new') {
            return this.api.createQuestion(question);
        } else {
            this.api.updateQuestion(question);
        }
    }

    /**
     *
     * @param {number} id
     */
    onDeleteQuestion(id) {
        this.api.deleteQuestion(id);
        document.getElementById(`question-${id}`).remove();
    }

    onAddChoice() {
        this.choiceCount++;
        const div = document.createElement('div');
        div.classList = ['row mb-3'];
        div.id = `choice-new-${this.choiceCount}`;

        div.innerHTML = `
            <div class="col-1">
                <input
                    type="radio"
                    name="choices-new"
                    data-choice-id="${this.choiceCount}"
                    class="form-check-input"
                />
            </div>
            <div class="col">
                <input
                    type="text"
                    data-question-choice="new"
                    data-choice-id="${this.choiceCount}"
                    class="form-control"
                />
            </div>
            <div class="col-1">
                <button
                    type="button"
                    id="delete-option-new-${this.choiceCount}"
                    class="btn btn-danger"
                >
                    Delete
                </button>
            </div>
        `;
        document.getElementById('choices').appendChild(div);

        document
            .getElementById(`delete-option-new-${this.choiceCount}`)
            .addEventListener(
                'click',
                this.onDeleteChoice.bind(this, this.choiceCount)
            );
    }

    /**
     *
     * @param {number} id
     */
    onDeleteChoice(id) {
        document.getElementById(`choice-new-${id}`).remove();
    }
}
