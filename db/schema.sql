CREATE DATABASE employees;

USE employees;

CREATE TABLE department(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);
CREATE TABLE role(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT, 
    FOREIGN KEY (department_id)REFERENCES department(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULl,
    manager_id INT ,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);


INSERT INTO department(name)
VALUES("R&D"),("Sales"),("HR"),("Dont look in here");

INSERT INTO role(title,salary,department_id)
VALUES("Chief",20,1),("Salesrep",1,2),("hr",2,3),("why did you look in there?",-1,4);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES("jo","jo",1,NULL),("greg","smith",2,1),("jane","doe", 4, NULL),("mike","j",3,2);
