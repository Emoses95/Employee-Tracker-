// Imported packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password here
        password: 'password',
        database: 'tracker_db'
    },
    console.log("Connecting to tracker_db database")
);

const employees = [];
const departments = [];
const roles = [];

const connectingToDb = () => {
    return new Promise((resolve, reject) => {
        const onConnect = (err) => {
            if (err) reject(err)

            console.log("Connected to db")
            resolve()
        }
        db.connect(onConnect)
    })
}

const init = async () => {
    await connectingToDb()

    // Inquirer prompts
    const menu = () => {
        inquirer.prompt([
            {
                type: 'list',
                message: 'Hello, how can I help you',
                name: "next",
                choices: ['Add department', 'View all departments', 'Add a role', 'View all roles', 'Add an employee', "View all employees", "Update an employee role", 'Exit'],

            }
        ]).then(ans => {
            if (ans.next === 'Add department') {
                newDepartment();
            } else if (ans.next === 'View all departments') {
                viewDepartments();
            } else if (ans.next === "Add a role") {
                addRole();
            } else if (ans.next === "View all roles") {
                viewRoles();
            } else if (ans.next === "Add an employee") {
                addEmployee();
            } else if (ans.next === 'View all employees') {
                viewEmployees();
            } else if (ans.next === 'Update an employee') {
                updateEmployee();
            } else {
                exit();
            }

        })
    }

    menu()

    const newDepartment = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'New Department',
                message: 'Name of the new department'

            }
        ]).then(ans => {
            const newDepartment = new department(ans.newDepartment)
            viewDepartments.push(newDepartment)
            console.log(departments)
            menu();
        })
    }

    const viewDepartments = () => {
        db.query('SELECT * FROM department', function (err, data) {
            if (err) {
                console.table(err)
            }
            console.table(data);
        });
    }

    const addRole = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'New Role',
                message: "Name of the new role"
            },
            {
                type: 'input',
                name: 'Salary',
                message: 'Salary of the position'
            },
            {
                type: "input",
                name: "Role",
                message: "Which department does the role belong to?",
                choices: ['Sales', 'Finance', 'Management', 'Engineering']
            }
        ]).then(ans => {
            const addRole = new role(ans.addRole)
            viewRoles.push(addRole)
            console.log(roles)
            menu()
        })
    }

    const viewRoles = () => {
        db.query('SELECT * FROM role', function (err, data) {
            if (err) {
                console.table(err)
            }
            console.table(data);
        });
    }

    const addEmployee = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'addEmployee',
                message: 'Name of new employee'
            }
        ]).then(ans => {
            const newEmployee = new employee(ans.addEmployee);
            viewEmployees.push(newEmployee);
            console.log(employees);
            menu();
        });
    }


    const viewEmployees = () => {
        db.query('SELECT * FROM employees', function (err, data) {
            if (err) {
                console.table(err)
            }
            console.table(data);
        });
    }
}







init()