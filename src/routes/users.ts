import { Router } from "express";
import { createUser, getUserByUsername, getUsers, updateUser } from "../controllers/users";
import bodyParser, { BodyParser} from "body-parser";

const router = Router();

const jsonParser = bodyParser.json()
// /players
router.get('/',  getUsers);

// /players/123
router.get('/:username', getUserByUsername)

// /players/

router.post('/', jsonParser, createUser)

router.put("/:username", jsonParser, updateUser)

export default router;