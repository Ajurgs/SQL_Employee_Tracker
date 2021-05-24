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
          removeEmployee();
          break;
        case "Update Employee Role":
          UpdateEmployeeRole();
          break;
        case "Update Employee Manager":
          UpdateEmployeeManager();
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove Role":
          removeRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Remove Department":
          removeDepartment();
          break;
        case "Exit":
          connection.end();
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
        baseQuestions();
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
              baseQuestions();
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
                  baseQuestions();
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
      baseQuestions();
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
      baseQuestions();
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
      baseQuestions();
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
              baseQuestions();
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
              baseQuestions();
            }
          );
        });
    }
  );
}
// Update-------------
// employee roles
function UpdateEmployeeRole() {
  const employees = [];
  const roles = [];
  connection.query(
    "SELECT CONCAT (first_name, ' ', last_name) as name, employee.id as id FROM employee",
    (err, res) => {
      if (err) throw err;
      res.forEach((employee) => {
        employees.push({ name: employee.name, value: employee.id });
      });
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
                type: "list",
                message: "What Employee do you Want to Update?",
                choices: employees,
                name: "employee",
              },
              {
                type: "list",
                message: "What is the new Employees Role?",
                name: "role",
                choices: roles,
              },
            ])
            .then((answers) => {
              connection.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [answers.role, answers.employee],
                (err, res) => {
                  if (err) throw err;
                  console.log("Employees role Updated");
                  baseQuestions();
                }
              );
            });
        }
      );
    }
  );
}
// employee managers (optional)
function UpdateEmployeeManager() {
  const employees = [];
  const managers = [];
  connection.query(
    "SELECT CONCAT (first_name, ' ', last_name) as name, employee.id as id FROM employee",
    (err, res) => {
      if (err) throw err;
      res.forEach((employee) => {
        employees.push({ name: employee.name, value: employee.id });
      });
      employees.push({ name: "Does Not Have A Manager", value: "Null" });
      connection.query(
        "SELECT CONCAT (first_name, ' ', last_name) as name, employee.id as id FROM employee WHERE is_Manager = true",
        (err, res) => {
          if (err) throw err;
          res.forEach((employee) => {
            managers.push({ name: employee.name, value: employee.id });
          });
          managers.push({ name: "Does Not Have A Manager", value: "Null" });
          inquirer
            .prompt([
              {
                type: "list",
                message: "What Employee do you Want to Update?",
                choices: employees,
                name: "employee",
              },
              {
                type: "list",
                message: "Who is the Employees new Manager?",
                name: "manager",
                choices: managers,
              },
            ])
            .then((answers) => {
              connection.query(
                "UPDATE employee SET manager_id = ? WHERE id = ?",
                [answers.manager, answers.employee],
                (err, res) => {
                  if (err) throw err;
                  console.log("Employees manager Updated");
                  baseQuestions();
                }
              );
            });
        }
      );
    }
  );
}
// Delete
// departments
function removeDepartment() {
  const departments = [];
  connection.query(
    "SELECT department.name as name, department.id as id FROM department",
    (err, res) => {
      if (err) throw err;
      res.forEach((department) => {
        departments.push({ name: department.name, value: department.id });
        inquirer
          .prompt([
            {
              type: "list",
              message: "What Department do you Want to Remove?",
              choices: departments,
              name: "department",
            },
          ])
          .then((answers) => {
            connection.query(
              `update role set department_id = null where department_id = ?;
              DELETE FROM department WHERE id = ?;`,
              [answers.department, answers.department],
              (err, res) => {
                if (err) throw err;
                console.log("departments Removed");
                baseQuestions();
              }
            );
          });
      });
    }
  );
}
// roles
function removeRole() {
  const roles = [];
  connection.query(
    "SELECT role.name as name, role.id as id FROM role",
    (err, res) => {
      if (err) throw err;
      res.forEach((role) => {
        roles.push({ name: role.name, value: role.id });
        inquirer
          .prompt([
            {
              type: "list",
              message: "What role do you Want to Remove?",
              choices: roles,
              name: "role",
            },
          ])
          .then((answers) => {
            connection.query(
              `update employee set role_id = 1 where role_id = ?;
              DELETE FROM role WHERE id = ?;`,
              [answers.role, answers.role],
              (err, res) => {
                if (err) throw err;
                console.log("roles Removed");
                baseQuestions();
              }
            );
          });
      });
    }
  );
}

// employees
function removeEmployee() {
  const employees = [];
  connection.query(
    "SELECT CONCAT (first_name, ' ', last_name) as name, employee.id as id FROM employee",
    (err, res) => {
      if (err) throw err;
      res.forEach((employee) => {
        employees.push({ name: employee.name, value: employee.id });
      });
      inquirer
        .prompt([
          {
            type: "list",
            message: "What Employee do you Want to Remove?",
            choices: employees,
            name: "employee",
          },
        ])
        .then((answers) => {
          connection.query(
            `update employee set manager_id = null where manager_id = ?; DELETE FROM employee WHERE id = ?;`,
            [answers.employee, answers.employee],
            (err, res) => {
              if (err) throw err;
              console.log("Employee Removed");
              baseQuestions();
            }
          );
        });
    }
  );
}
