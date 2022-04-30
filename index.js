const inquirer = require('inquirer');
const connection = require('./config/connection');
const consoleTable = require('console.table');


inquirer.prompt([
    {
        type: 'list',
        name: 'options',
        message: 'Welcome to the Employee Tracker. Please select which option you would like.',
        choices: ['View ALL employees.', 'View ALL roles.', 'View ALL departments.', 'Update employee role.', 'Add employee.', 'Add role.', 'Add department', 'Finished']
    },

])
.then ((response) => {
    
})

//add the rest of the prompts