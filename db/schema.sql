DROP DATABASE IF EXISTS company;
CREATE DATABASE company;
\c company;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
CREATE TABLE department(
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);
CREATE TABLE roles(
    role_id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER,
    CONSTRAINT fk_department
    FOREIGN KEY(department_id) REFERENCES department(department_id)
    );

    CREATE TABLE employee(
        employee_id SERIAL PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        manager_id INTEGER,
        role_id INTEGER,
        CONSTRAINT fk_role
        FOREIGN KEY(role_id) REFERENCES roles(role_id)
        
     )