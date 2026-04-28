import { UserSensitiveDto, UserSensitiveProjection} from "../dtos/UserSensitive.dto";
import bcrypt from "bcryptjs";
import * as userRepository from "../repositiories/user.repository";
import { LoginError } from "../errors/LoginError";
import { NotFoundError } from "../errors/NotFoundError";

export async function login(loginKey:string, password:string) {

        const players:UserSensitiveDto[] = (await userRepository.
            getSensitiveUsersByUsernameOrEmail(loginKey)) as UserSensitiveDto[];

        if (players.length > 0) {
            // case found account with matching key
            // verify password
            const player:UserSensitiveDto = players[0];
            const isMatch:boolean = await bcrypt.compare(password, player.password);
            
            if (isMatch) {
                // return the login token stored on database
                return player.token;
            } else {
                throw new LoginError();
            }
        } else {
            // case can't find a matching user
            throw new NotFoundError();
        }
}

export async function authenticate(token:string) {
    const player:UserSensitiveDto = (await userRepository.getPlayerByToken(token)) as UserSensitiveDto;
    
    if (!player) {
        throw new NotFoundError();
    } else {
        return player;
    }
}