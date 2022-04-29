const inquirer = require('inquirer');
const connection = require('./config/connection');
const consoleTable = require('console.table');


prompt([
    {
        type: 'list',
        name: 'start',
        message: 'Welcome to the Employee Tracker. Please select continue to start.',
        choices: ['Start', 'Quit']
    },

])
.then ((response) => {
    
})

