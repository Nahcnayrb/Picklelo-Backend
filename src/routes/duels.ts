import { Router } from "express";
import { getDuels, createDuel, updateDuel, deleteDuel, getDuelsByUsername } from "../controllers/duels";
import bodyParser, { BodyParser} from "body-parser";

const router = Router();

const jsonParser = bodyParser.json()
// /duels
router.get('/',  getDuels);

// only get duels concerning a specific user
router.get('/:username',  getDuelsByUsername);

router.post('/', jsonParser, createDuel)

router.put("/:duelId", jsonParser, updateDuel)

router.delete("/:duelId", deleteDuel)

export default router; 