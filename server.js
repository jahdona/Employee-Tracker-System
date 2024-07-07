const pool=require('./config/connection');
const express=require('express');
const inquirer=require('inquirer');
const figlet=require('figlet');
const validity=require('./assets/js/index');
const chalk = require('chalk');

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
const promptUser=()=>{
    inquirer.prompt([
        {
            name:'choices',
            type:'list',
            message:'Please select an option:',
            choices:[
                'View All Employees',
                'View All roles',
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
            case 'View All Employees By Departments':
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
                    viewAllRolles();
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

            case 'View Department Budgets':
                ViewDepartmentBudget();
                break;

            case 'Remove Department':
                removeDepartment();
                break;

            default:
                connection.end();
                break;
        }

    });
};