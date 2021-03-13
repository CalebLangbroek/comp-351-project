CREATE USER 'comp-351-project'@'localhost' IDENTIFIED BY 'password';

GRANT DELETE ON comp_351_project.* TO 'comp-351-project'@'localhost';
GRANT INSERT ON comp_351_project.* TO 'comp-351-project'@'localhost';
GRANT SELECT ON comp_351_project.* TO 'comp-351-project'@'localhost';
GRANT UPDATE ON comp_351_project.* TO 'comp-351-project'@'localhost';

SHOW GRANTS FOR 'comp-351-project'@'localhost';