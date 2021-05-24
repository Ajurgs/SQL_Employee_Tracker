// start asking questions
require("console.table");
const connection = require("./db/connection");
const inquirer = require("inquirer");

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
          break;
        case "View Department Expenses":
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
// employees
function viewEmployee() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
  });
}
// employees by manager (optional)
// budget of a department
// Update-------------
// employee roles
// employee managers (optional)
// Delete
// departments
// roles
// employees
