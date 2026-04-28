import { DuelDto } from "../dtos/Duel.dto";
import {Request, Response} from "express"
import * as duelService from "../services/duel.service";
import { CreateError } from "../errors/CreateError";
import { UpdateError } from "../errors/UpdateError";
import { NotFoundError } from "../errors/NotFoundError";

export async function getDuels(request:Request, response:Response) {
    try {
        const duels:DuelDto[] = await duelService.getAllDuels();
            response.status(200).send(duels);
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}

export async function getDuelsByUsername(request:Request<{username:string},{},{}>, response:Response) {
    try {
        const duels:DuelDto[] = await duelService.getDuelsByUsername(request.params.username);
        // totally ok if duels is empty here
        // a player can have 0 duels if never played
        response.status(200).send(duels);
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}

export async function createDuel(request:Request<{},{}, DuelDto>, response:Response) {
    
    try {
        const duelData:DuelDto = request.body as DuelDto;
        await duelService.createDuel(duelData);

        response.status(201).send("Created a new duel.");
    } catch (error) {
        if (error instanceof CreateError) {
            response.status(500).send("Failed to create a new duel.");
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}

export async function updateDuel(request:Request<{duelId:string},{}, DuelDto>,response:Response) {
    try {
        const duelData:DuelDto = request.body as DuelDto;
        const duelId:string =  request.params.duelId;

        await duelService.updateDuel(duelId, duelData);

        response.status(201).send("Updated duel.")
    } catch (error) {
        if (error instanceof UpdateError) {
            response.status(500).send("Failed to update duel.");
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }

}

export async function deleteDuel(request:Request<{duelId:string},{},{}>, response:Response) {
    try {
        const duelId:string =  request.params.duelId;
        await duelService.deleteDuel(duelId);

        response.status(201).send("Deleted duel.");
    } catch (error) {
        if (error instanceof NotFoundError) {
            response.status(404).send("Could not delete duel with the given duelId.");
        } else if (error instanceof UpdateError) {
            response.status(500).send("Error occured while updating player elos");
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}