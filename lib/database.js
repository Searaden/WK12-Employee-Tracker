const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employee_tracker' // Update this if needed
});

//Get and add Departments

async function getAllDepartments() {
    try {
        const [rows] = await pool.query('SELECT * FROM department');
        return rows;
    } catch(error){
        console.error("Error retrieving departments:", error);
        throw error;
    }
}

async function addDepartment(name) {
    try {
        const [result] = await pool.query('INSERT INTO department (name) VALUES (?)', [name]);
        return result;
    } catch (error){
        console.error('Error adding department:', error);
        throw error;
    }
}

//Get and add employees

async function getAllEmployees() {
    try {
        const [rows] = await pool.query('SELECT * FROM employee');
        return rows;
    } catch(error){
        console.error("Error retrieving employees:", error);
        throw error;
    }
}

async function addEmployee(firstName, lastName, roleId, managerId) {
    try {
        const [result] = await pool.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [firstName, lastName, roleId, managerId]
        );
        return result;
    } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
    }
}

//Get and add roles

async function getAllRoles() {
    try {
        const [rows] = await pool.query('SELECT * FROM role');
        return rows;
    } catch(error){
        console.error("Error retrieving roles:", error);
        throw error;
    }
}

async function addRole(title, salary, department_id) {
    try {
        const [result] = await pool.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [title, salary, department_id]);
        return result;
    } catch (error){
        console.error('Error adding role:', error);
        throw error;
    }
}

//Update employee roles

async function updateEmployee(employeeId, roleId) {
    try {
        const [result] = await pool.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
        return result;
    } catch (error){
        console.error('Error updating employee role:', error);
        throw error;
    }
}

module.exports = {
    getAllDepartments,
    addDepartment,
    getAllEmployees,
    addEmployee,
    getAllRoles,
    addRole,
    updateEmployee
};
