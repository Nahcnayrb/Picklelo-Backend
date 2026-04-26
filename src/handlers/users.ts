import {Request, Response} from "express"
import { UserDto } from "../dtos/User.dto";
import { collections } from "../services/database.service";
import bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { ObjectId } from "mongodb";

export async function getUsers(request:Request, response:Response) {
    try {
        const players:UserDto[] = (await collections.players!.find({}).toArray()) as UserDto[];
            response.status(200).send(players);
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
} 

export async function getUserByUsername(request:Request<{username: string},{},{}>, response:Response) {
    try {
        const players:UserDto[] = (await collections.players!.find({username: request.params.username}).toArray()) as UserDto[];
        if (players.length == 0) {
            response.status(400).send("could not find the specified user.")
        } else {
            response.status(200).send(players[0]);
        }
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }

} 

export async function createUser(request:Request<{},{}, UserDto>, response:Response) {

    // check if username or email is taken
    // if yes, abort registration since both must be unique

    try {
        const playerData:UserDto = request.body as UserDto;


        const playersWithUsername:UserDto[] = (await collections.players!.find({username: playerData.username}).toArray()) as UserDto[];
        const playersWithEmail:UserDto[] = (await collections.players!.find({email: playerData.email}).toArray()) as UserDto[];

        if (playersWithUsername.length > 0) {
            return response.status(400).send("username is already taken.");

        } else if (playersWithEmail.length > 0) {
            return response.status(401).send("email is already taken.");

        } else {
                // case registration is ok
            
            // hash password

            const hashedPassword:string = await bcrypt.hash(playerData.password, 10);

            playerData.email = playerData.email.trim().toLowerCase();
            playerData.username = playerData.username.trim().toLowerCase();
            playerData.password = hashedPassword;
            playerData.elo = 1000;
            playerData.hasPfp = false;
            playerData.token = crypto.randomUUID();
            const result = await collections.players?.insertOne(playerData);

            
            return result
            ? response.status(201).send({id: result.insertedId, username: playerData.username, email:  playerData.email, elo:  playerData.elo, password:  playerData.password, token: playerData.token})
            : response.status(500).send("Failed to create a new player.");
        }

    } catch (error) {
        if (error instanceof Error) {
            return response.status(500).send(error.message);
        }
    }
}

export async function updateUser(request:Request<{username: string},{}, UserDto>, response:Response) {

    try {
        const playerData:UserDto = request.body as UserDto;
        const query = {username: request.params.username};

        const result = await collections.players?.updateOne(query, {$set: playerData})

        return result
        ? response.status(201).send("Updated Player.")
        : response.status(500).send("Failed to update player.");

    } catch (error) {
        if (error instanceof Error) {
            return response.status(500).send(error.message);
        }
    }


}