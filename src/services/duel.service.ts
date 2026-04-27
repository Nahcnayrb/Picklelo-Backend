import { DuelDto } from "../dtos/Duel.dto";
import { CreateError } from "../errors/CreateError";
import { NotFoundError } from "../errors/NotFoundError";
import { UpdateError } from "../errors/UpdateError";
import * as duelRepository from "../repositiories/duel.repository";

export async function getAllDuels() {
    const duels: DuelDto[] = (await duelRepository.getAllDuels()) as DuelDto[];
    return duels;
}

export async function getDuelsByUsername(username: string) {
    const duels: DuelDto[] = (await duelRepository.getDuelsByUsername(username)) as DuelDto[];
    return duels;
}

export async function createDuel(duel: DuelDto) {
    duel.date = new Date();
    const result = await duelRepository.createDuel(duel);
    if (!result.acknowledged) {
        throw new CreateError();
    } else {
        return result.insertedId;
    }
}

export async function updateDuel(duelId: string, duelData: DuelDto) {

    const result = await duelRepository.updateDuel(duelId, duelData);
    if (!result.acknowledged) {
        throw new UpdateError();
    } else {
        return result.upsertedId;
    }
    
}

export async function deleteDuel(duelId: string) {
    const result = await duelRepository.deleteDuel(duelId);
    if (result.deletedCount == 0) {
        // case could not find a matching duel to delete
        throw new NotFoundError();
    } else {
        return result.acknowledged;
    }
}