import { Router } from "express";
import { getDuels, createDuel, updateDuel, deleteDuel, getDuelsByUsername } from "../controllers/duels";
import bodyParser, { BodyParser} from "body-parser";

const router = Router();

const jsonParser = bodyParser.json()
// GET /duels
router.get('/',  getDuels);

// GET /duels/<username>
router.get('/:username',  getDuelsByUsername);

// POST /duels
router.post('/', jsonParser, createDuel)

// PUT /duels/<duelId>
router.put("/:duelId", jsonParser, updateDuel)

// DELETE /duels/<duelId>
router.delete("/:duelId", deleteDuel)

export default router; 