DROP DATABASE IF EXISTS employees;
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
    is_manager BOOL DEFAULT false,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department(name)
VALUES("R&D"),("Sales"),("HR"),("Engineering"),("Administration");

INSERT INTO role(title,salary,department_id)
VALUES("Unasigned",0,null),("Research Team Lead",60000,1),("Resercher",450000,1),("Salesrep",45000,2),("hr",37500,3),("CEO",1000000,5),("Manufacturer",50000,4);

INSERT INTO employee(first_name,last_name,role_id,manager_id,is_manager)
VALUES("Jo","Jo",6,null,true),("Greg","Smith",2,1,true),("Jane","Doe", 4, 1,true),("Mike","Porter",3,2,false),("Rachel","Winkle",4,1,false),("Zac","Lee",5,1,true),("Chris","Mann",5,6,false);


