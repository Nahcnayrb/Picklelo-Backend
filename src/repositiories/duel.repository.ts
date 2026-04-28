import { DuelDto } from "../dtos/Duel.dto";
import { collections } from "../services/database.service";
import { ObjectId } from "mongodb";

export async function getAllDuels() {
    return collections.duels!.find({}).toArray();
}

export async function getDuelsByUsername(username: string) {
    return collections.duels!.find(
        { 
            $or: [{higherEloUsername: username},
                {lowerEloUsername: username}]
        }
    ).toArray();
}

export async function getDuelById(id: string) {
    return collections.duels!.findOne({_id: new ObjectId(id)});
}

export async function createDuel(duel: DuelDto) {
    return collections.duels!.insertOne(duel);
}

export async function updateDuel(duelId: string, duelData: DuelDto) {
    const query = {_id: new ObjectId(duelId)};
    return collections.duels!.updateOne(query, {$set: duelData})
}

export async function deleteDuel(duelId: string) {
    const query = {_id: new ObjectId(duelId)};
    return collections.duels!.deleteOne(query);
}