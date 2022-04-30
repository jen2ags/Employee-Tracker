const inquirer = require('inquirer');
const connection = require('./db/connection');
const consoleTable = require('console.table');


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

const viewEmployees =
//add the rest of the prompts