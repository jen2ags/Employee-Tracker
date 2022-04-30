const inquirer = require('inquirer');
const connection = require('./db/connection');
const consoleTable = require('console.table');
const db = require('./db/connection');


const startOptions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'Welcome to the Employee Tracker. Please select which option you would like.',
            choices: [
                'View ALL employees',
                'View ALL roles',
                'View ALL departments',
                'Update employee role',
                'Add employee',
                'Add role',
                'Add department',
                'Finished'
            ]
        }
    ])
        .then((answers) => {
            const selectedOption = answers.toDo;
            if (selectedOption === 'View ALL employees') {
                viewEmployees();
            };
            if (selectedOption === 'View ALL roles') {
                viewRoles();
            };
            if (selectedOption === 'View ALL departments') {
                viewDepartments();
            };
            if (selectedOption === 'Update employee role') {
                updateEmployeeRole();
            };
            if (selectedOption === 'Add employee') {
                addEmployee();
            };
            if (selectedOption === 'Add role') {
                addRole();
            };
            if (selectedOption === 'Add department') {
                addDepartment();
            };
            if (selectedOption === 'Finished') {
                process.finished();
            };
        })
};

const viewEmployees = () => {
    const sql = `SELECT employees.id,
                        employees.first_name,
                        employees.last_name,
                        roles.title AS title,
                        roles.salary AS salary,
                        departments.name AS department,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees manager ON employees.manager_id = manager.id`;
    
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        return startOptions();
    });
};

const viewRoles = () => {

}

const viewDepartments = () => {

}

const updateEmployeeRole = () => {

}

const addEmployee = () => {

}

const addRole = () => {

}

const addDepartment = () => {

}

module.exports = startOptions;
//add the rest of the prompts