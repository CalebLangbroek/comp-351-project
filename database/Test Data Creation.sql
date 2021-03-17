INSERT INTO question (question_id, text) VALUES (1, 'What is 4+4?');
INSERT INTO choice (`question_id`, `text`) VALUES (1, '8');
INSERT INTO choice (`question_id`, `text`) VALUES (1, '34');
INSERT INTO choice (`question_id`, `text`) VALUES (1, '4');
INSERT INTO choice (`question_id`, `text`) VALUES (1, '2');
INSERT INTO answer (question_id, choice_id) VALUES (1, 1)

-- Cleans table
TRUNCATE TABLE question;