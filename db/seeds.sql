USE company;
INSERT INTO departments (name)
VALUES 
    ('Engineering'), 
    ('Marketing'),  
    ('Media'), 
    ('Production'), 
    ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Entry Level Engineer', 100000, 1),
    ('Associate Engineer', 130000, 1),
    ('Senior Engineer', 175000, 1), 
    ('Marketing Designer', 90000, 2), 
    ('Marketing Coordinator', 110000, 2),
    ('Senior Marketing Designer', 125000, 2),
    ('Media Intern', 50000, 3), 
    ('Media Coordinator', 75000, 3),
    ('Media Director', 100000, 3),
    ('Production Technician', 65000, 4),
    ('Production Operator', 80000, 4),
    ('Production Lead', 100000, 4),
    ('Regional Sales Manager', 70000, 5),
    ('Sales Account Manager', 95000, 5),
    ('VP of Sales', 130000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Aaron', 'Smith', 1, 3),
    ('Jake', 'King', 2, 3),
    ('Ashley', 'Miller', 3, NULL),
    ('Amanda', 'Anderson', 5, 6),
    ('Kevin', 'Hill', 6, NULL),
    ('Karen', 'Hooks', 9, NULL),
    ('Cheryl', 'Crow', 11, 12),
    ('Manny', 'Moore', 12, NULL),
    ('Mandy', 'Harbrough', 13, 15),
    ('Corey', 'Alvarado', 15, NULL);

