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
            } else if (ans.next === 'Update an employee role') {
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
                name: 'department',
                message: 'Name of the new department'

            }
        ]).then(ans => {
            db.query(`INSERT INTO department (department_name) VALUES ('${ans.department}') `)
            console.log('new department has been added')
            menu();
        })
    }

    const viewDepartments = () => {
        db.query('SELECT * FROM department', function (err, data) {
            if (err) {
                console.table(err)
            }
            console.table(data);
            menu();
        });
    }

    const addRole = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'new_role',
                message: "Name of the new role"
            },
            {
                type: 'input',
                name: 'Salary',
                message: 'Salary of the position'
            },
            {
                type: "input",
                name: "department",
                message: "Which department does the role belong to?",
                choices: ['Sales', 'Finance', 'Management', 'Engineering']
            }
        ]).then(ans => {
            // const addRole = new Role(ans.addRole)
            // viewRoles.push(addRole)
            // console.log(roles)
            // menu()
            // console.log(`INSERT INTO role(job_title,salary,department_id) VALUES('${ans.job_title}', ${ans.salary},${ans.department_id}) `)
            db.query(`INSERT INTO role(job_title,salary,department_id) VALUES('${ans.new_role}', ${ans.Salary},${ans.department}) `)
            console.log('new role has been added')
            menu();
        })
    }

    const viewRoles = () => {
        db.query('SELECT * FROM role', function (err, data) {
            if (err) {
                console.table(err)
            }
            console.table(data);
            menu();
        });
    }

    const addEmployee = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'First name of new employee'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Last name of new employee'
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'Role added to new employee'
            }

        ]).then(ans => {
            // const newEmployee = new employee(ans.addEmployee);
            // viewEmployees.push(newEmployee);
            // console.log(employees);
            // menu();
            db.query(`INSERT INTO employee (first_name,last_name,role_id) VALUES('${ans.first_name}', '${ans.last_name}', ${ans.role_id})`)
            console.log('new employee has been added')
            menu();
        });
    }


    const viewEmployees = () => {
        db.query('SELECT * FROM employee', function (err, data) {
            if (err) {
                console.table(err)
            }
            console.table(data);
            menu();
        });
    }

    const updateEmployee = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'update',
                message: 'update an employee role'

            }
        ]).then(ans => {
            db.query(`UPDATE employee SET role_id = '${ans.update}' Where name  `)
            console.log('employee role has been updated')
            menu();
        })
    }


}




init()