CREATE DATABASE comp_351_project;

CREATE TABLE `question` (
    `question_id` INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `text` VARCHAR( 255 ) NOT NULL
);

CREATE TABLE `choice` (
    `choice_id` INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `question_id` INT( 11 ) NOT NULL,
    `text` VARCHAR( 255 ) NOT NULL,
    CONSTRAINT fk_question FOREIGN KEY ( question_id ) REFERENCES question(question_id)
);

CREATE TABLE `answer` (
    `answer_id` INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `question_id` INT( 11 ) NOT NULL,
    `choice_id` INT( 11 ) NOT NULL,
    CONSTRAINT fk_answerquestion FOREIGN KEY ( question_id ) REFERENCES question(question_id),
    CONSTRAINT fk_answerchoice FOREIGN KEY ( choice_id ) REFERENCES choice(choice_id)
);
