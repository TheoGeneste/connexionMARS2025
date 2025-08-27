import db from "../config/db.js";

// Fonction pour récupérer tous les clients
export const getAllClients = async () => {
    const sql = 'SELECT * FROM clients;';
    const [results] = await db.query(sql);
    return results;
}

export const getClientByEmail = async (email) => {
    const sql = 'SELECT * FROM clients WHERE email = ?;';
    const [results] = await db.query(sql, [email]);
    return results[0];
}

export const createClient = async (client) => {
    const { first_name, last_name, phone, email, password } = client;
    const sql = 'INSERT INTO clients (first_name, last_name,phone, email, password, role) VALUES (?, ?, ?, ?,?,?);';
    const [result] = await db.query(sql, [first_name, last_name,phone, email, password, 'USER']);
    return result.insertId;
}