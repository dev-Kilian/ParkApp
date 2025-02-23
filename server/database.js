import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

/**
 * REGISTRO DE ENTRADA Y SALIDA DE VEHÍCULOS
 */
export async function registerEntry(gate, vehiclePlate, clientId) {
  const entryTime = new Date();
  const [result] = await pool.query(
    `INSERT INTO gateRegistry (gate, vehiclePlate, entry_date_time, client_id) VALUES (?, ?, ?, ?)`,
    [gate, vehiclePlate, entryTime, clientId]
  );
  return result.insertId;
}

export async function registerExit(registryId, amount) {
  const exitTime = new Date();
  await pool.query(
    `UPDATE gateRegistry SET exit_date_time = ?, amount = ? WHERE id = ? AND exit_date_time IS NULL`,
    [exitTime, amount, registryId]
  );
}

export async function getGateRegisterByID(id) {
  const [row] = await pool.query(
    `SELECT * FROM gateRegistry WHERE id = ?`,
    [id]
  );
  return row[0];
}

export async function getAllGateRegisters() {
  const [rows] = await pool.query(`SELECT * FROM gateRegistry ORDER BY entry_date_time DESC`);
  return rows;
}


/**
 * GESTIÓN DE CLIENTES Y SUSCRIPCIONES
 */
export async function addClient(vehiclePlate, name, email, phoneNumber, hasSubscription) {
  const [result] = await pool.query(
    `INSERT INTO clients (vehiclePlate, name, email, phone_number, has_subscription) VALUES (?, ?, ?, ?, ?)`,
    [vehiclePlate, name, email, phoneNumber, hasSubscription]
  );
  return result.insertId;
}

export async function updateClient(id, name, email, phoneNumber, hasSubscription) {
  await pool.query(
    `UPDATE clients SET name = ?, email = ?, phone_number = ?, has_subscription = ? WHERE id = ?`,
    [name, email, phoneNumber, hasSubscription, id]
  );
}

export async function deleteClient(id) {
  await pool.query(`DELETE FROM clients WHERE id = ?`, [id]);
}

export async function addSubscription(clientId, subscriptionType, startDate, endDate) {
  const [result] = await pool.query(
    `INSERT INTO subscriptions (client_id, subscription_type, start_date, end_date) VALUES (?, ?, ?, ?)`,
    [clientId, subscriptionType, startDate, endDate]
  );
  return result.insertId;
}

export async function deleteSubscription(id) {
  await pool.query(`DELETE FROM subscriptions WHERE id = ?`, [id]);
}

/**
 * GESTIÓN DE EMPLEADOS (AUTENTICACIÓN)
 */
export async function addEmployee(name, email, password, phoneNumber, isAdmin) {
  const [result] = await pool.query(
    `INSERT INTO employees (name, email, password, phone_number, is_admin) VALUES (?, ?, ?, ?, ?)`,
    [name, email, password, phoneNumber, isAdmin]
  );
  return result.insertId;
}

export async function getEmployeeByEmail(email) {
  const [rows] = await pool.query(
    `SELECT * FROM employees WHERE email = ?`,
    [email]
  );
  return rows[0];
}
