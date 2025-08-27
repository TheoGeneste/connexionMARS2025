import * as clientModel from "../models/clientModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const getAllClients = async (req, res) => {
    try {
        const client = await clientModel.getAllClients();
        return res.status(200).json(client);
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const client = await clientModel.getClientByEmail(email);
        if (!client) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Vérification du mot de passe (à implémenter avec bcrypt)
        const isPasswordValid =  bcrypt.compareSync(password, client.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: client.id, email: client.email, role: client.role, lastName: client.last_name, firstName: client.first_name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: 'Login successful', 'token' : token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const register = async (req, res) => {
    const { first_name, last_name, phone, email, password } = req.body;

    if (!first_name || !last_name || !phone || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Vérification si l'utilisateur existe déjà
        const existingClient = await clientModel.getClientByEmail(email);
        if (existingClient) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hashage du mot de passe
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Création du nouvel utilisateur
        const newClient = {
            first_name,
            last_name,
            phone,
            email,
            password: hashedPassword
        };

        const clientId = await clientModel.createClient(newClient);
        // Envoi d'un email de bienvenue
        await transporter.sendMail({
            from: '"Support" <theobialasik@gmail.com>',
            to: email,
            subject: "Bienvenue chez nous !",
            text: `Bonjour ${first_name},\n\nMerci de vous être inscrit sur notre plateforme.\n\nCordialement,\nL'équipe`,
            // html: "<b>Hello world?</b>" // html body
        });
        res.status(201).json({ message: 'Client registered successfully', clientId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const getProfile = async (req, res) => {
    try {
        const client = await clientModel.getClientByEmail(req.user.email);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}