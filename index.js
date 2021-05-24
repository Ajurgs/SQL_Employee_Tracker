// start asking questions
require("console.table");
const connection = require("./db/connection");
const inquirer = require("inquirer");

const addEmployeeQuestions = [{}];
const addDepartmentQuestions = [
  {
    type: "input",
    message: "What is the new Department Name?",
    name: "name",
  },
];

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
        case "View Employees by Manager":
          viewEmployeeByManager();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Departments":
          viewDepartments();
          break;
        case "View Department Expenses":
          viewDepartmentExpenses();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          break;
        case "Update Employee":
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove Role":
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Remove Department":
          break;
        case "Exit":
          break;
      }
    });
}

// add-------------------
// departments
function addDepartment() {
  inquirer.prompt(addDepartmentQuestions).then((answers) => {
    connection.query(
      "INSERT INTO department(name)",
      [answers.name],
      (err, res) => {
        if (err) throw err;
        console.log("department added");
      }
    );
  });
}
// roles
function addRole() {
  const departments = [];
  connection.query(
    "SELECT department.name as department, department.id as id FROM department",
    (err, res) => {
      if (err) throw err;
      res.forEach((department) => {
        departments.push({ name: department.department, value: department.id });
      });
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the new Role Name?",
            name: "name",
          },
          {
            type: "input",
            message: "What is the new Role Salary?",
            name: "salary",
            validate: function (input) {
              if (isNaN(input)) {
                return "Must Enter A Number";
              } else {
                return true;
              }
            },
          },
          {
            type: "list",
            message: "What is the new Role Department?",
            name: "department",
            choices: departments,
          },
        ])
        .then((answers) => {
          connection.query(
            "INSERT INTO role(title,salary,department_id) VALUES (?,?,?)",
            [answers.name, answers.salary, answers.department],
            (err, res) => {
              if (err) throw err;
              console.log("role added");
            }
          );
        });
    }
  );
}

// employees
function addEmployee() {
  const managers = [];
  const roles = [];
  connection.query(
    "SELECT CONCAT (first_name, ' ', last_name) as name, employee.id as id FROM employee WHERE is_manager = true;",
    (err, res) => {
      if (err) throw err;
      res.forEach((manager) => {
        managers.push({ name: manager.name, value: manager.id });
      });
      managers.push({ name: "Does Not Have A Manager", value: "Null" });
      connection.query(
        "SELECT role.title as role, role.id as id FROM role",
        (err, res) => {
          if (err) throw err;
          res.forEach((role) => {
            roles.push({ name: role.role, value: role.id });
          });
          inquirer
            .prompt([
              {
                type: "input",
                message: "What is the new Employees first Name?",
                name: "first_name",
              },
              {
                type: "input",
                message: "What is the new Employees last Name?",
                name: "last_name",
              },
              {
                type: "list",
                message: "What is the new Employees Role?",
                name: "role",
                choices: roles,
              },
              {
                type: "list",
                message: "Who is the new Employee's Manager?",
                name: "manager",
                choices: managers,
              },
              {
                type: "list",
                message: "Is the new Employee a Manager?",
                name: "isManager",
                choices: [true, false],
              },
            ])
            .then((answers) => {
              connection.query(
                "INSERT INTO employee(first_name,last_name,role_id,manager_id,is_manager) VALUES (?,?,?,?,?)",
                [
                  answers.first_name,
                  answers.last_name,
                  answers.role,
                  answers.manager,
                  answers.isManager,
                ],
                (err, res) => {
                  if (err) throw err;
                  console.log("Employee added");
                }
              );
            });
        }
      );
    }
  );
}
// view-------------------
// depatrments
function viewDepartments() {
  connection.query(
    "SELECT department.name as department FROM department",
    (err, res) => {
      if (err) throw err;
      console.table(res);
    }
  );
}
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
