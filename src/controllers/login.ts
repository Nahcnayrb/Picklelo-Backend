import { Request, Response } from "express"
import { NotFoundError } from "../errors/NotFoundError";
import * as loginService from "../services/login.service";
import { LoginError } from "../errors/LoginError";

export async function login(request:Request, response:Response) {
   try {
        let loginKey:string = request.body.key; // this field can either be username or password
        loginKey = loginKey.toLowerCase();
        const password:string = request.body.password;

        const token = await loginService.login(loginKey, password);
        response.status(200).send(token);

    } catch (error) {
        if (error instanceof NotFoundError) {
            response.status(404).send("No user exists with the given username/email.");
        } else if (error instanceof LoginError) {
            response.status(400).send("Login credentials are incorrect.");
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}


export async function authenticate(request:Request, response:Response) {
    try {
        const token:string = request.params.token;
        const player = await loginService.authenticate(token);

        response.status(200).send(player)
        
    } catch (error) {
        if (error instanceof NotFoundError) {
            response.status(404).send("could not find user given token.")
        } else if (error instanceof Error) {
            response.status(500).send(error.message);
        }
    }
}