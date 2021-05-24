// start asking questions
require("console.table");
const connection = require("./db/connection");
const inquirer = require("inquirer");

baseQuestions();

// ask user for staring input
function baseQuestions() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View All Employees",
        "View Employees by Department",
        "View Employees by Manager",
        "View Department Expenses",
        "Add Employee",
        "Remove Employee",
        "Update Employee",
        "Add Role",
        "Remove Role",
        "Add Department",
        "Remove Department",
      ],
    })
    .then((res) => {
      switch (res.choice) {
        case "View All Employees":
          viewEmployee();
          break;
        case "View Employees by Department":
          break;
        case "View Employees by Manager":
          viewEmployeeByManager();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Department Expenses":
          viewDepartmentExpenses();
          break;
        case "Add Employee":
          break;
        case "Remove Employee":
          break;
        case "Update Employee":
          break;
        case "Add Role":
          break;
        case "Remove Role":
          break;
        case "Add Department":
          break;
        case "Remove Department":
          break;
      }
    });
}

// add-------------------
// departments
// roles
// employees
// view-------------------
// depatrments
// roles
function viewRoles() {
  connection.query(
    "SELECT role.title, role.salary, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
    }
  );
}
// employees
function viewEmployee() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
    }
  );
}
// employees by manager (optional)
function viewEmployeeByManager() {
  let managers = [];
  connection.query(
    "SELECT CONCAT (first_name, ' ', last_name) as manager FROM employee WHERE is_manager = true;",
    (err, res) => {
      if (err) throw err;
      res.forEach((manager) => {
        managers.push(manager.manager);
      });
      inquirer
        .prompt({
          type: "list",
          message: "What Managers Employees would you like to view?",
          name: "name",
          choices: managers,
        })
        .then((res) => {
          connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id WHERE CONCAT(manager.first_name, ' ', manager.last_name) = ?",
            res.name,
            (err, res) => {
              if (err) throw err;
              console.table(res);
            }
          );
        });
    }
  );
}
function viewEmployeeByDepartment() {}
// budget of a department
function viewDepartmentExpenses() {
  const departments = [];
  connection.query(
    "SELECT department.name as department FROM department",
    (err, res) => {
      if (err) throw err;
      res.forEach((department) => {
        departments.push(department.department);
      });
      inquirer
        .prompt({
          type: "list",
          message: "What Departments Budget would you like to view?",
          name: "name",
          choices: departments,
        })
        .then((res) => {
          let department = res.name;
          connection.query(
            "SELECT SUM(role.salary) as Total FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN  department ON role.department_id = department.id WHERE department.name = ?",
            res.name,
            (err, res) => {
              if (err) throw err;
              console.log(res);
              console.log(
                `The Total Expenses of The  ${department} is $${res[0].Total}`
              );
            }
          );
        });
    }
  );
}
// Update-------------
// employee roles
// employee managers (optional)
// Delete
// departments
// roles
// employees
