const inquirer = require('inquirer');
const consoleTable = require('console.table');
const express = require('express');
const db = require('./db/connection');
const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res) => {
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
                process.exit();
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

    db.query(sql, (err, rows) => {

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
        if (err) {
            throw err;
        }
        const employees = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: employees
            }
        ])
            .then(employeeResponse => {
                const employee = employeeResponse.employee;
                const params = [employee];
                const sql = `SELECT title, id FROM roles`;

                db.query(sql, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    const roles = rows.map(({ title, id }) => ({ name: title, value: id }));

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

                            db.query(sql, params, (err) => {
                                if (err) {
                                    throw err;
                                }
                                console.log('Employee role has been updated!');
                                return viewEmployees();
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
            name: 'firstName',
            message: "What is the new employee's first name?",
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log('Please enter a valid name.');
                    return false;
                };
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the new employee's last name?",
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                } else {
                    console.log('Please enter a valid name.');
                    return false;
                };
            }
        },

    ])
        .then(answer => {
            const params = [answer.firstName, answer.lastName];
            const sql = `SELECT * FROM roles`;

            db.query(sql, (err, rows) => {
                if (err) {
                    throw err;
                }
                const roles = rows.map(({ title, id }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the new employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleResponse => {
                        const role = roleResponse.role;
                        params.push(role);
                        const sql = `SELECT * FROM employees`;

                        db.query(sql, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            const manager = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
                            manager.push({name: 'No manager', value: null});

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the new employee's manager?",
                                    choices: manager
                                }
                            ])
                                .then(managerResponse => {
                                    const managers = managerResponse.managers;
                                    params.push(managers);
                                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                                VALUES (?, ?, ?, ?)`;

                                    db.query(sql, params, (err) => {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log('Employee has been created!');
                                        return viewEmployees();
                                    });
                                });
                            });
                        });
                    });
                });
            };
            
            const addRole = () => {
                
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: "What is the new role in the company?",
                        validate: roleInput => {
                            if (roleInput) {
                            return true;
                        } else {
                            console.log('Please enter a valid role.');
                            return false;
                            };
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: "What is the salary of the new role?",
                        validate: salaryInput => {
                            if (salaryInput) {
                            return true;
                        } else {
                            console.log('Please enter a valid salary.');
                            return false;
                            };
                        }
                    }
                ])
                .then (response => {
                    const params = [response.role, response.salary];
                    const sql = `SELECT * FROM departments`;
        
                    db.query(sql, (err, rows) => {
                        if (err) {
                            throw err;
                        }
                        const departments = rows.map(({ name, id }) => ({ name: name, value: id }));
        
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'departments',
                                message: "Which department will this new role be in?",
                                choices: departments
                            }
                        ])
                        .then(departmentResponse => {
                            const departments = departmentResponse.departments;
                            params.push(departments);
                            const sql = `INSERT INTO roles (title, salary, department_id)
                                        VALUES (?, ?, ?)`;

                            db.query(sql, params, (err) => {
                                if (err) {
                                    throw err;
                                }
                                console.log('A new role for the company has been created!');
                                return viewRoles();
                            });
                        });
                    });
                });
            };
            
            const addDepartment = () => {

                return inquirer.prompt([
                    {
                        type: 'input',
                        name: 'department',
                        message: 'What department would you like to add to the company?',
                        validate: departmentInput => {
                            if (departmentInput) {
                                return true;
                            } else {
                                console.log('Please enter a valid department name.');
                                return false;
                            };
                        }
                    },
                ])
                .then (departmentResponse => {
                    const sql = `INSERT INTO departments (name)
                                VALUES (?)`;
                    
                    const params = departmentResponse.department;
                    db.query(sql, params, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('The new department has beed added!');
                        return viewDepartments();
                    });
                });
            };

module.exports = startOptions;
