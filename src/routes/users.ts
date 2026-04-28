import { Router } from "express";
import { createUser, getUserByUsername, getUsers, updateUser } from "../controllers/users";
import bodyParser, { BodyParser} from "body-parser";

const router = Router();

const jsonParser = bodyParser.json()

// GET /players
router.get('/',  getUsers);

// GET/players/<username>
router.get('/:username', getUserByUsername)

// POST /players
router.post('/', jsonParser, createUser)

// PUT /players/<username>
router.put("/:username", jsonParser, updateUser)

export default router;