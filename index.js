const inquirer = require('inquirer');
const {
    //createDatabaseSchema,
    //seedData,
    getAllDepartments,
    addDepartment,
    getAllEmployees,
    addEmployee,
    getAllRoles,
    addRole,
    updateEmployee
} = require('./lib/database');

const { default: ListPrompt } = require('inquirer/lib/prompts/list');

async function mainMenu() {
    try {
        //await createDatabaseSchema();
        //await seedData();
        const departments = await getAllDepartments();

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'Add a department',
                    'View all roles',
                    'Add a role', 
                    'View all employees',
                    'Add an employee',
                    'Update an employee role',
                ]

            }
        ]);

        switch (choice) {
            case ('View all departments'):
                
                console.table(departments);
                await mainMenu();
                break;
            
            case ('Add a department'):
                const { departmentName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'departmentName',
                        message: 'What is the name of the department?'
                    }
                ]);
                await addDepartment(departmentName);

                console.log('Department added successfully!');
                await mainMenu();
                break;

            case('View all roles'):
                const roles = await getAllRoles();
                console.table(roles);
                await mainMenu();
                break;

            case ('Add a role'):
                const departmentChoices = departments.map(department =>({
                    name: department.name,
                    value: department.id
                }));
                const roleInfo = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'What is the name of the Role?'
                    },
                    
                    {
                        type: 'input',
                        name: 'salaryAmount',
                        message: 'What is the salary for the role?'
                    },

                    {
                        type: 'list',
                        name: 'departmentForRole',
                        message: 'What department is the role in?:',
                        choices: await departmentChoices
                    }
                ]);
                await addRole(roleInfo.title, roleInfo.salaryAmount, roleInfo.departmentForRole);
                console.log('Role added successfully!');
                await mainMenu();
                break;

            case('View all employees'):
                const employees = await getAllEmployees();
                console.table(employees);
                await mainMenu();
                break;

            case('Add an employee'):
                const rolesForEmployees = await getAllRoles();
                const managersForEmployees = await getAllEmployees();

                const roleChoicesForEmployees = rolesForEmployees.map(role =>({
                    name: role.title,
                    value: role.id
                }));
                
                const managerChoicesForEmployees = managersForEmployees.map(manager =>({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id
                }))


                const { firstName , lastName, roleId, managerId } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name?',
                    },

                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name?',
                    },

                    {
                        type: 'list',
                        name: 'roleId',
                        message: 'What is the employees role?',
                        choices: roleChoicesForEmployees
                    },

                    {
                        type: 'list',
                        name: 'managerId',
                        message: 'Who is the employees manager?',
                        choices: managerChoicesForEmployees
                    }
                ]);
                await addEmployee(firstName, lastName, roleId, managerId);
                console.log('Employee added successfully!');
                await mainMenu();
                break;
            
                case 'Update an employee role':
                    const employeesForUpdate = await getAllEmployees();
        
                    const employeeChoices = employeesForUpdate.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }));
        
                    const { employeeIdToUpdate } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employeeIdToUpdate',
                            message: 'Select an Employee to update their role: ',
                            choices: employeeChoices
                        }
                    ]);
        
                    const rolesForUpdate = await getAllRoles();
        
                    const roleChoices = rolesForUpdate.map(role => ({
                        name: role.title,
                        value: role.id
                    }));
        
                    const { roleIdToUpdate } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'roleIdToUpdate',
                            message: 'Select the employee\'s new role: ',
                            choices: roleChoices
                        }
                    ]);
        
                    await updateEmployee(employeeIdToUpdate, roleIdToUpdate);
                    console.log('Employee role updated!');
                    await mainMenu();
                    break;
                }
            } catch (error) {
                console.error('Error in mainMenu:', error);
            }
        }
        
        mainMenu();