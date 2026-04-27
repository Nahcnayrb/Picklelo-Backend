import {Request, Response} from "express"
import { UserDto } from "../dtos/User.dto";
import { UserPublicDto } from "../dtos/UserPublic.dto";

import * as userService from "../services/user.service";
import { NotFoundError } from "../errors/NotFoundError";

import { UsernameTakenError } from "../errors/UsernameTakenError";
import { EmailTakenError } from "../errors/EmailTakenError";
import { UpdateError } from "../errors/UpdateError";

export async function getUsers(request:Request, response:Response) {
    try {
        const players: UserPublicDto[] = await userService.getAllUsers();
        response.status(200).send(players);
    } catch (error) {
        if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
} 

export async function getUserByUsername(request:Request<{username: string},{},{}>, response:Response) {
    try {
        const player:UserPublicDto = await userService.getUserByUsername(request.params.username)
        response.status(200).send(player);
    } catch (error) {
        if (error instanceof NotFoundError) {
            response.status(400).send("could not find the specified user.")
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
} 

export async function createUser(request:Request<{},{}, UserDto>, response:Response) {

    try {
        const playerData:UserDto = request.body as UserDto;
        const playerId = await userService.createUser(playerData);

        response.status(201).send({
            ...playerData,
            id: playerId
        });
    } catch (error) {
        if (error instanceof UsernameTakenError) {
            response.status(400).send("Username already taken.");
        } else if (error instanceof EmailTakenError) {
            response.status(401).send("Email already taken.");
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}

export async function updateUser(request:Request<{username: string},{}, UserDto>, response:Response) {
    try {
        const playerData:UserDto = request.body as UserDto;
        await userService.updateUser(request.params.username, playerData);
        response.status(201).send("Updated Player.");

    } catch (error) {
        if (error instanceof UpdateError) {
            response.status(500).send("Failed to update player.");
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }

}