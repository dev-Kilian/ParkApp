CREATE DATABASE parkApp;

USE parkApp;

CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiclePlate VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(255)  UNIQUE,
    has_subscription BOOLEAN DEFAULT false
);

CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    subscription_type VARCHAR(255) NOT NULL,  -- Abono mensual, anual, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);


CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(255)  UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE gateRegistry (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Registro de entrada/salida
    gate INT NOT NULL, -- Puerta por la que accede el vehículo
    vehiclePlate VARCHAR(255) NOT NULL,
    entry_date_time DATETIME NOT NULL,
    exit_date_time DATETIME DEFAULT NULL,
    client_id INT DEFAULT NULL,  -- Puede ser NULL para clientes de rotación
    amount DECIMAL(10, 2) DEFAULT 0,  -- El precio que se cobra (diferente entre abonados y no abonados)
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);