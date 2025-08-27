import * as clientController from "../controllers/clientController.js";
import express from "express";
const router = express.Router();

router.get('/clients', clientController.getAllClients);

router.post('/login', clientController.login);

router.post('/register', clientController.register);

export default router;