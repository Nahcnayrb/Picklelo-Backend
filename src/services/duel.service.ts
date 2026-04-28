import { DuelDto } from "../dtos/Duel.dto";
import { UserPublicDto } from "../dtos/UserPublic.dto";
import { UserDto } from "../dtos/User.dto";
import { CreateError } from "../errors/CreateError";
import { NotFoundError } from "../errors/NotFoundError";
import { UpdateError } from "../errors/UpdateError";
import * as duelRepository from "../repositiories/duel.repository";
import * as userService from "../services/user.service";

export async function getAllDuels() {
    const duels: DuelDto[] = (await duelRepository.getAllDuels()) as DuelDto[];
    return duels;
}

export async function getDuelsByUsername(username: string) {
    const duels: DuelDto[] = (await duelRepository.getDuelsByUsername(username)) as DuelDto[];
    return duels;
}

export async function getDuelById(id: string) {
    const duel: DuelDto = (await duelRepository.getDuelById(id)) as DuelDto;
    if (duel == null) {
        throw new NotFoundError();
    } else {
        return duel;
    }
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
    const duel:DuelDto = (await duelRepository.getDuelById(duelId)) as DuelDto;

    // once we find the duel, revert the elos of the players involved if the match is completed
    if (duel.higherEloScore != null && duel.lowerEloScore != null) {
        console.log("revert elos yay");
        // case duel is completed, need to revert elos
        await revertPlayerElos(duel);
    }

    // after player elos are reverted, delete duel from db
    const result = await duelRepository.deleteDuel(duelId);
    if (result.deletedCount == 0) {
        // case could not find a matching duel to delete
        throw new NotFoundError();
    } else {
        return result.acknowledged;
    }
}

async function revertPlayerElos(duel:DuelDto) {
    const revertEloAmount: number = getRevertEloAmount(duel);

    const teamSize: number = duel.isDoublesMatch ? 2 : 1;
    const didHigherEloTeamWin = higherEloTeamWon(duel);

    // for doubles matches, we repeat elo revert process again, because there are 2 players on each team
    for (let i:number = 0; i < teamSize; i++) {
        const higherEloPlayer: UserDto = (await userService.getUserByUsername(duel.higherEloUsername[i])) as UserDto;
        const lowerEloPlayer: UserDto = (await userService.getUserByUsername(duel.lowerEloUsername[i])) as UserDto;
        let newHigherEloPlayerElo: number = higherEloPlayer.elo;
        let newLowerEloPlayerElo: number = lowerEloPlayer.elo;

        if (didHigherEloTeamWin) {
            // case higher elo team won the duel
            // to cancel out the changes:
            //  1) need to subtract revertEloAmount from the higher elo player
            //  2) need to add revertEloAmount to lower elo player
            newHigherEloPlayerElo -= revertEloAmount;
            newLowerEloPlayerElo += revertEloAmount;

        } else {
            // case lower elo team won the duel
            // to cancel out the changes:
            //  1) need to add revertEloAmount to the higher elo player
            //  2) need to subtract revertEloAmount from lower elo player
            newHigherEloPlayerElo += revertEloAmount;
            newLowerEloPlayerElo -= revertEloAmount;
        }

        // update players with their corresponding new elos
        higherEloPlayer.elo = newHigherEloPlayerElo;
        lowerEloPlayer.elo = newLowerEloPlayerElo;
        await userService.updateUser(higherEloPlayer.username, higherEloPlayer);
        await userService.updateUser(lowerEloPlayer.username, lowerEloPlayer);
        
    }

}

function getRevertEloAmount(duel:DuelDto) {
    if (higherEloTeamWon(duel)) {
        // case higher elo team won
        return duel.higherEloGainPotential;
    } else {
        // case lower elo team won
        return duel.lowerEloGainPotential;
    }

}

function higherEloTeamWon(duel:DuelDto) {
    return (duel.higherEloScore > duel.lowerEloScore);
}