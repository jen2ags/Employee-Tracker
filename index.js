const inquirer = require('inquirer');
const connection = require('./config/connection');
const consoleTable = require('console.table');


inquirer.prompt([
    {
        type: 'list',
        name: 'start',
        message: 'Welcome to the Employee Tracker. Please select continue to start.',
        choices: ['Start', 'Quit']
    },

])
.then ((response) => {
    
})

//add the rest of the prompts