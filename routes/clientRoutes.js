import * as clientController from "../controllers/clientController.js";
import express from "express";
import { checkToken } from "../middlewares/checkToken.js";
const router = express.Router();

router.get('/clients', clientController.getAllClients);

router.post('/login', clientController.login);

router.post('/register', clientController.register);

router.get('/profile', checkToken, clientController.getProfile)

export default router;