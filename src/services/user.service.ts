import * as userRepository from "../repositiories/user.repository";
import { UserPublicDto } from "../dtos/UserPublic.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { UserDto } from "../dtos/User.dto";
import { UsernameTakenError } from "../errors/UsernameTakenError";
import { EmailTakenError } from "../errors/EmailTakenError";
import bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { UpdateError } from "../errors/UpdateError";


export async function getAllUsers() {
    const users: UserPublicDto[] = (await userRepository.getAllUsers()) as UserPublicDto[];
    return users;
}

export async function getUserByUsername(username: string) {
    const user: UserPublicDto = await (userRepository.getUserByUsername(username)) as UserPublicDto;
    if (user == null) {
        // throw err
        throw new NotFoundError();
    } else {
        return user;
    }
}

export async function getUserByEmail(email: string) {
    const user: UserPublicDto = await (userRepository.getUserByEmail(email)) as UserPublicDto;
    if (user == null) {
        // throw err
        throw new NotFoundError();
    } else {
        return user;
    }
}

// create a new user and returns its userId if successful. throw error otherwise
export async function createUser(user: UserDto) {
    // check if username or email is taken
    // if yes, abort registration since both must be unique

    const userWithUsername:UserDto = (await userRepository.getUserByUsername(user.username)) as UserDto;
    const userWithEmail:UserDto = (await userRepository.getUserByEmail(user.email)) as UserDto;

    if (userWithUsername !== null) {
        throw new UsernameTakenError();
    } else if (userWithEmail !== null) {
        throw new EmailTakenError();
    } else {
        // case registration data is ok
        // hash password
        const hashedPassword:string = await bcrypt.hash(user.password, 10);

        user.email = user.email.trim().toLowerCase();
        user.username = user.username.trim().toLowerCase();
        user.password = hashedPassword;
        user.elo = 1000; // default elo
        user.hasPfp = false;
        user.token = crypto.randomUUID();

        const result = await userRepository.createUser(user);
        return result!.insertedId;
    }
}

export async function updateUser(username: string, userData: UserDto) {

    const result = await userRepository.updateUser(username, userData);
    if (!result!.acknowledged) {
        // case fail
        throw new UpdateError();
    }
}
