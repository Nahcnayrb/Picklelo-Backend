import { collections } from "../services/database.service";
import { UserPublicProjection } from "../dtos/UserPublic.dto";
import { UserDto } from "../dtos/User.dto";

export async function getAllUsers() {
    return collections.players!.find({},
                {projection: UserPublicProjection}).toArray();
}

export async function getUserByUsername(username: string) {
    return collections.players!.findOne({username: username},
        {projection: UserPublicProjection});
            
}

export async function getUserByEmail(email: string) {
    return collections.players!.findOne({email: email},
        {projection: UserPublicProjection});
}

export async function createUser(user: UserDto) {
    return collections.players?.insertOne(user);
}

export async function updateUser(username: string, userData: UserDto) {
    const query = {username: username};
    return collections.players?.updateOne(query, {$set: userData});
}