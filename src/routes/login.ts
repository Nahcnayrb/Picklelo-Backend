import { Router,Request, Response } from "express";
import bodyParser, { BodyParser} from "body-parser";
import { collections } from "../services/database.service";
import { UserDto } from "../dtos/User.dto";
import bcrypt from "bcryptjs";
import { BlobServiceClient } from '@azure/storage-blob';

const router = Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, async (request:Request, response:Response) => {

    try {
        let loginKey:string = request.body.key; // this field can either be username or password
        loginKey = loginKey.toLowerCase();
        const password:string = request.body.password;
        const players:UserDto[] = (await collections.players!.find({$or: [{username: loginKey},{email: loginKey}]}).toArray()) as UserDto[];

        if (players.length > 0) {
            // case found account with matching key
            // verify password
            const player:UserDto = players[0];
            const isMatch:boolean = await bcrypt.compare(password, player.password);
            
            if (isMatch) {
                // return the login token stored on database
                return response.status(200).send(player.token);
            }

        }

        return response.status(404).send("login credentials are incorrect.");

    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return response.status(400).send(error.message);
        }
    }

})

router.get("/authenticate/:token", jsonParser, async (request:Request, response:Response) => {

    const token:string = request.params.token;

    const players = (await collections.players!.find({token: token}).toArray()) as UserDto[];
    
    if (players.length == 0) {
        return response.status(404).send("could not find user given token.")
    } else {
        const player:UserDto = players[0]
        return response.status(200).send(player)
    }


})

export default router;