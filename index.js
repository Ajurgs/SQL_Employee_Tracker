// start asking questions
require("console.table");
const connection = require("./db/connection");
const inquirer = require("inquirer");

// ask user for staring input
function baseQuestions() {
  inquirer.prompt({
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
// employees by manager (optional)
// budget of a department
// Update-------------
// employee roles
// employee managers (optional)
// Delete
// departments
// roles
// employees
