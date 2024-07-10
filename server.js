const pool=require('./config/connection');
const express=require('express');
const inquirer=require('inquirer');
const figlet=require('figlet');
const validity=require('./assets/js/index');
const chalk = require('chalk');
//Database connection
pool.connect((error)=>{
    if(error) throw error;
    console.log(chalk.yellow.bold(`============================================================================================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker System')));
    console.log(``);
    console.log(`                                                                     ` + chalk.greenBright.bold('Created by Jean de Dieu Habiyaremye'));
    console.log(``);
    console.log(chalk.yellow.bold(`=============================================================================================================================`));
    promptUser();
})
// Prompt User Choices
const promptUser=()=>{
    inquirer.prompt([
        {
            name:'choices',
            type:'list',
            message:'Please select an option:',
            choices:[
                'View All Employees',
                'View All Roles',
                'View All Departments',
                'View All Employees By Department',
                'View Department Budget',
                'Update Employee Role',
                'Update Employee Manager',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Exit'
            ]
        }
    ])
    .then((answers)=>{
        const {choices}=answers;
        switch(choices){
            case 'View All Employees':
                viewAllEmployees();
                break;
             case 'View All Departments':
                viewAllDepartments();
                 break;
            case 'View All Employees By Department':
                viewAllEmployeesByDepartments();
                  break;
            case 'Add Employee':
               addEmployee();
                 break;
            case 'Remove Employee':
                removeEmployee();
                 break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
               updateEmployeeManager();
                break;
             case 'View All Roles':
                    viewAllRoles();
                 break;
            case 'Add Role':
                    addRole();
                break;
            case 'Remove Role':
                    removeRole();
                break;
            case 'Add Department':
                addDepartment();
                break;

            case 'View Department Budget':
                ViewDepartmentBudget();
                break;

            case 'Remove Department':
                removeDepartment();
                break;

            default:
                pool.end();
                break;
        }

    });
};

//----------------------------------------------View-------------------------------
const viewAllEmployees=()=>{
    let sql=`SELECT employee_id,first_name,last_name,title,
                department_name AS Department,salary FROM
                employee,role,department WHERE
                department.department_id=role.department_id
                AND role.role_id=employee.role_id
                ORDER BY employee_id ASC
                `;
    pool.query(sql,(error,response)=>{
        if(error) throw error;
        console.log(chalk.yellow.bold(`=========================================================================`));
        console.log(`                                               `+ chalk.green.bold(`Current Employees:`));
        console.table(response.rows);
        console.log(chalk.yellow.bold(`============================================================================`));
        promptUser();
    });
};
//-------------------------View all ROles-------------------------------------
const viewAllRoles=()=>{
    let sql=`SELECT role_id,title,department_name AS Department FROM role
            INNER JOIN department ON role.department_id=department.department_id`;
    console.log(chalk.yellow.bold(`==================================================================================`));
    console.log(`                                                   `+chalk.green.bold(`Current Employee Roles:`));
    pool.query(sql,(error,response)=>{
        if(error) throw error;
        console.table(response.rows);
        console.log(chalk.yellow.bold(`========================================================================================`));
        promptUser();
    });
};
//------------------------View all Departments------------------------------------------
const viewAllDepartments=()=>{
    let sql=`SELECT department_id,department_name FROM department`;
    console.log(chalk.yellow.bold(`==================================================================================`));
    console.log(`                                                   `+chalk.green.bold(`Current Employee Roles:`));
    pool.query(sql,(error,response)=>{
        if(error) throw error;
        console.table(response.rows);
        console.log(chalk.yellow.bold(`=================================================================================`));
        promptUser();
    });
};
//--------------------View all Employee by Department------------------------------
const viewAllEmployeesByDepartments=()=>{
    let sql=`SELECT first_name,last_name,title,department_name FROM employee 
    LEFT JOIN role ON employee.role_id=role.role_id
    LEFT JOIN department ON role.department_id=department.department_id`;
    console.log(chalk.yellow.bold(`==================================================================================`));
    console.log(`                                                   `+chalk.green.bold(` Employees By Department:`));
    pool.query(sql,(error,response)=>{
        if (error) throw error;
        console.table(response.rows);
        console.log(chalk.yellow.bold(`================================================================================`));
        promptUser();
    });
};
//------------------------View all Departments by Budget----------------------------
const ViewDepartmentBudget=()=>{
    let sql=`SELECT role.department_id AS ID,department_name,SUM(salary) AS Budget
            FROM role INNER JOIN department ON role.department_id=department.department_id 
            GROUP BY role.department_id,department_name`;
    console.log(chalk.yellow.bold(`==================================================================================`));
    console.log(`                                                   `+chalk.green.bold(` Budget By Department:`));
    pool.query(sql,(error,response)=>{
            if (error) throw error;
                console.table(response.rows);
                console.log(chalk.yellow.bold(`================================================================================`));
        promptUser();
    });
};
//---------------------------------------------- ADD ------------------------------------------------------------------------------
                //-----------------------Add a New Employee---------------------------------------------------------------
const addEmployee=()=>{
    inquirer.prompt([
        {
            type:'input',
            name:'firstName',
            message:"What is the employee's first name? ",
            validate:addFirstName=>{
                if(addFirstName){
                    return true;
                }
                else{
                    console.log('Please enter first name');
                    return false;
                }
            }
        },
        {
            type:'input',
            name:'lastName',
            message:"What is the employee's last name? ",
            validate:addLastName=>{
                if(addLastName)
                {
                    return true;
                }
                else{
                    console.log('Please enter last name');
                    return false;
                }
            }

        },
       
    ])
    .then(answer=>{
        const emp=[answer.firstName,answer.lastName]
        const roleSql=`SELECT role_id, title FROM role`;
        pool.query(roleSql,(error,data)=>{
            if (error) throw error;
            const roles=data.rows.map(({role_id,title})=>({name:title,value:role_id}));
            inquirer.prompt([
                {
                    type:'list',
                    name:'role',
                    message:"What is the employee's role? ",
                    choices:roles
                }
            ])
            .then(roleChoice=>{
                const role=roleChoice.role;
                emp.push(role);
                const managerSql=`SELECT * FROM employee`;
                pool.query(managerSql,(error,data)=>{
                    if(error) throw error;
                    let dataRow=data.rows;
                    const managers=dataRow.map(({employee_id,first_name,last_name})=>({name:first_name+" "+last_name,value:employee_id}));
                    inquirer.prompt([
                        {
                            type:'list',
                            name:'manager',
                            message:"What is you employee's manager? ",
                            choices:managers
                        }
                    ])
                    .then(managerChoice=>{
                        const manager=managerChoice.manager;
                        emp.push(manager);
                        let sql=`INSERT INTO employee(first_name,last_name,role_id,manager_id)
                                    VALUES($1,$2,$3,$4)`;
                        pool.query(sql,emp,(error)=>{
                            if(error) throw error;
                            console.log("Employee has been added successfully");
                            viewAllEmployees();
                        });
                    });
                });
            });
        });
    });
};

//-------------------------- Add a New Role-------------------------------------
const addRole=()=>{
    const sql=`SELECT * FROM department`
    pool.query(sql,(error,response)=>{
        if(error) throw error;
        let deptNamesArray=[];
        response.rows.forEach((department)=>{deptNamesArray.push(department.department_name);});
        deptNamesArray.push('Create Department');
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'departmentName',
                    message:'Which department is the new role in? ',
                    choices:deptNamesArray
                }
            ])
            .then((answer)=>{
                if(answer.departmentName==='Create Department'){
                    this.addDepartment();
                }
                else{
                    addRoleResume(answer);
                }
            });
        const addRoleResume =(departmentData)=>{
            inquirer
            .prompt([
                {
                    type:'input',
                    name:'newRole',
                    message:'What is the title of the new role?',
                    validate:validity.validateString

                },
                {
                    type:'input',
                    name:'salary',
                    message:'What is the salary of this new role? ',
                    validate:validity.validateSalary

                }
            ])
            .then((answer)=>{
                let createdRole=answer.newRole;
                let roleSalary=answer.salary;
                let departmentId;
                response.rows.forEach((department)=>{
                    if(departmentData.departmentName===department.department_name){departmentId=department.depart}
                });
                let sql=`INSERT INTO role(title,salary,department_id) VALUES($1,$2,$3)`;
                let roleArray=[createdRole,roleSalary,departmentId];
                pool.query(sql,roleArray,(error)=>{
                    if(error) throw error;
                    console.log(chalk.yellow.bold(`====================================================================================`));
                    console.log(chalk.greenBright(`New Role successfully created!`));
                    console.log(chalk.yellow.bold(`====================================================================================`));
                    viewAllRoles();
                });
            });

        };
    });
};

//--------------------------- Add a New Department -------------------------------------------------
const addDepartment=()=>{
    inquirer
    .prompt([
        {
             type:'input',
             name:'newDepartment',
             message:'What is the name ofthe new department?',
             validate:validity.validateString
        }
        

    ])
    .then((answer)=>{

        let sql=`INSERT INTO department(department_name) VALUES($1)`;
        let depArray=[answer.newDepartment]
        pool.query(sql,depArray,(error)=>{
            if(error) throw error;
            console.log(``);
          console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
          console.log(``);
          viewAllDepartments();
        });
    });
};

//------------------------------------- UPDATE --------------------------------------------------
//update an Employe's Role
const updateEmployeeRole=()=>{
    let sql=`SELECT employee_id,first_name,last_name,role.role_id FROM 
            employee,role,department WHERE department.department_id=role.department_id 
            AND employee.role_id`;
            pool.query(sql, (error, response) => {
                if (error) throw error;
                let employeeNamesArray = [];
                response.rows.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});
          
                let sql =     `SELECT role_id, title FROM role`;
                pool.query(sql, (error, response) => {
                  if (error) throw error;
                  let rolesArray = [];
                  response.rows.forEach((role) => {rolesArray.push(role.title);});
          
                  inquirer
                    .prompt([
                      {
                        name: 'chosenEmployee',
                        type: 'list',
                        message: 'Which employee has a new role?',
                        choices: employeeNamesArray
                      },
                      {
                        name: 'chosenRole',
                        type: 'list',
                        message: 'What is their new role?',
                        choices: rolesArray
                      }
                    ])
                    .then((answer) => {
                      let newTitleId, employeeId;
          
                      response.forEach((role) => {
                        if (answer.chosenRole === role.title) {
                          newTitleId = role.role_id;
                        }
                      });
          
                      response.forEach((employee) => {
                        if (
                          answer.chosenEmployee ===
                          `${employee.first_name} ${employee.last_name}`
                        ) {
                          employeeId = employee.employee_id;
                        }
                      });
          
                      let sqls =    `UPDATE employee SET employee.role_id = $1 WHERE employee_id = $1`;
                      pool.query(
                        sqls,
                        [newTitleId, employeeId],
                        (error) => {
                          if (error) throw error;
                          console.log(chalk.greenBright.bold(`====================================================================================`));
                          console.log(chalk.greenBright(`Employee Role Updated`));
                          console.log(chalk.greenBright.bold(`====================================================================================`));
                          promptUser();
                        }
                      );
                    });
                });
              });
            };
          
          // Update an Employee's Manager
          const updateEmployeeManager = () => {
              let sql =       `SELECT employee.employee_id, employee.first_name, employee.last_name, employee.manager_id
                              FROM employee`;
               pool.query(sql, (error, response) => {
                if(error) throw error;
                let employeeNamesArray = [];
                response.rows.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});
          
                inquirer
                  .prompt([
                    {
                      name: 'chosenEmployee',
                      type: 'list',
                      message: 'Which employee has a new manager?',
                      choices: employeeNamesArray
                    },
                    {
                      name: 'newManager',
                      type: 'list',
                      message: 'Who is their manager?',
                      choices: employeeNamesArray
                    }
                  ])
                  .then((answer) => {
                    let employeeId, managerId;
                    response.rows.forEach((employee) => {
                      if (
                        answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
                      ) {
                        employeeId = employee.employee_id;
                      }
          
                      if (
                        answer.newManager === `${employee.first_name} ${employee.last_name}`
                      ) {
                        managerId = employee.employee_id;
                      }
                    });
          
                    if (validity.isSame(answer.chosenEmployee, answer.newManager)) {
                      console.log(chalk.redBright.bold(`====================================================================================`));
                      console.log(chalk.redBright(`Invalid Manager Selection`));
                      console.log(chalk.redBright.bold(`====================================================================================`));
                      promptUser();
                    } else {
                      let sql = `UPDATE employee SET employee.manager_id = $1 WHERE employee.employee_id = $1`;
          
                      pool.query(
                        sql,
                        [managerId, employeeId],
                        (error) => {
                          if (error) throw error;
                          console.log(chalk.greenBright.bold(`====================================================================================`));
                          console.log(chalk.greenBright(`Employee Manager Updated`));
                          console.log(chalk.greenBright.bold(`====================================================================================`));
                          promptUser();
                        }
                      );
                    }
                  });
              });
          };
          
          // -------------------------------------- REMOVE --------------------------------------------------------
          
          // Delete an Employee
          const removeEmployee = () => {
              let sql =     `SELECT employee.employee_id, employee.first_name, employee.last_name FROM employee`;
          
              pool.query(sql, (error, response) => {
                if (error) throw error;
                let employeeNamesArray = [];
                response.rows.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});
          
                inquirer
                  .prompt([
                    {
                      name: 'chosenEmployee',
                      type: 'list',
                      message: 'Which employee would you like to remove?',
                      choices: employeeNamesArray
                    }
                  ])
                  .then((answer) => {
                    let employeeId;
          
                    response.rows.forEach((employee) => {
                      if (
                        answer.chosenEmployee ===
                        `${employee.first_name} ${employee.last_name}`
                      ) {
                        employeeId = employee.employee_id;
                      }
                    });
          
                    let sql = `DELETE FROM employee WHERE employee.employee_id = $1`;
                    pool.query(sql, [employeeId], (error) => {
                      if (error) throw error;
                      console.log(chalk.redBright.bold(`====================================================================================`));
                      console.log(chalk.redBright(`Employee Successfully Removed`));
                      console.log(chalk.RedBright.bold(`====================================================================================`));
                      viewAllEmployees();
                    });
                  });
              });
            };
          
          // Delete a Role
          const removeRole = () => {
              let sql = `SELECT role.role_id, role.title FROM role`;
          
              pool.query(sql, (error, response) => {
                if (error) throw error;
                let roleNamesArray = [];
                response.rows.forEach((role) => {roleNamesArray.push(role.title);});
          
                inquirer
                  .prompt([
                    {
                      name: 'chosenRole',
                      type: 'list',
                      message: 'Which role would you like to remove?',
                      choices: roleNamesArray
                    }
                  ])
                  .then((answer) => {
                    let roleId;
          
                    response.rows.forEach((role) => {
                      if (answer.chosenRole === role.title) {
                        roleId = role.role_id;
                      }
                    });
          
                    let sql =   `DELETE FROM role WHERE role.role_id = $1`;
                    pool.query(sql, [roleId], (error) => {
                      if (error) throw error;
                      console.log(chalk.redBright.bold(`====================================================================================`));
                      console.log(chalk.greenBright(`Role Successfully Removed`));
                      console.log(chalk.redBright.bold(`====================================================================================`));
                      viewAllRoles();
                    });
                  });
              });
            };
          
          // Delete a Department
          const removeDepartment = () => {
              let sql = `SELECT department.department_id, department.department_name FROM department`;
              pool.query(sql, (error, response) => {
                if (error) throw error;
                let departmentNamesArray = [];
                response.rows.forEach((department) => {departmentNamesArray.push(department.department_name);});
          
                inquirer
                  .prompt([
                    {
                      name: 'chosenDept',
                      type: 'list',
                      message: 'Which department would you like to remove?',
                      choices: departmentNamesArray
                    }
                  ])
                  .then((answer) => {
                    let departmentId;
          
                    response.rows.forEach((department) => {
                      if (answer.chosenDept === department.department_name) {
                        departmentId = department.department_id;
                      }
                    });
          
                    let sql =`DELETE FROM department WHERE department.department_id = $1`;
                    pool.query(sql, [departmentId], (error) => {
                      if (error) throw error;
                      console.log(chalk.redBright.bold(`====================================================================================`));
                      console.log(chalk.redBright(`Department Successfully Removed`));
                      console.log(chalk.redBright.bold(`====================================================================================`));
                      viewAllDepartments();
                    });
                  });
              });
          };