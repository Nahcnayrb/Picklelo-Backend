import { Router } from "express";
import bodyParser from "body-parser";

import { login, authenticate } from "../controllers/login";

const router = Router();
const jsonParser = bodyParser.json();

// POST /login
router.post('/', jsonParser, login);

// GET /login/authenticate/<token>
router.get("/authenticate/:token", jsonParser, authenticate);

export default router;