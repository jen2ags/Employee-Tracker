const inquirer = require('inquirer');
const consoleTable = require('console.table');
const express = require('express');
const db = require('./db/connection');
const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req,res) => {
    res.status(404).end();
});

db.connect(err => {
    if (err)
    throw err;
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        startOptions();
    });
});


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
            const selectedOption = answers.options;
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
    const sql = `SELECT roles.id,
                        roles.title,
                        roles.salary,
                        departments.name AS department
                        
                FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id`;

    db.query(sql, (err, rows) => {
    if (err) {
    throw err;
    }
    console.table(rows);
    return startOptions();
    });
};

const viewDepartments = () => {
    const sql = `SELECT * FROM departments`;
    
    db.query(sql, (err,rows) => {
    
    if (err) {
    throw err;
    }
    console.table(rows);
    return startOptions();
    });
};

const updateEmployeeRole = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
        if(err) {
            throw err;
        }
        const employees = rows.map (({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        inquirer.prompt([
            {
                type:'list',
                name:'employee',
                message:'Which employee would you like to update?',
                choices: employees
            }
        ])
        .then(employeeResponse => {
            const employee = employeeResponse.employee;
            const params = [employee];
            const sql = `SELECT title, id FROM roles`;

            db.query(sql, (err,rows)=> {
                if (err) {
                    throw err;
                }
                const roles = rows.map (({title, id}) => ({name: title, value: id}));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the new role of this employee?',
                        choices: roles
                    }
                ])
                .then(rolesResponse => {
                    const role = rolesResponse.role;
                    params.unshift(role);
                    const sql = `UPDATE employees
                                SET role_id = ?
                                WHERE id = ?`
                    
                    db.query(sql, params, (err)=> {
                        if (err) {
                            throw err;
                        }
                        console.log('Employee role has been updated!');
                        return startOptions();
                    });
                });
            });
        });
    });
};   

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: ''
        }
    ])
}

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: ''
        }
    ])
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: ''
        }
    ])
}

module.exports = startOptions;
//add the rest of the prompts