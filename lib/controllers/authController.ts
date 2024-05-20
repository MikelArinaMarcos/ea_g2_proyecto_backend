import { Request, Response } from 'express'
import * as jwt from "jsonwebtoken";
import userService from "../models/users/service";
import users from '../models/users/schema';
import IJwtPayload from '../models/JWTPayload';
import {IUser} from '../models/users/model';


export class AuthController{

    private _SECRET: string = 'api+jwt';
    private user_service: userService = new userService();
    
    
    public async signin(req: Request, res: Response): Promise<Response> {

        const email = req.body.email;
        const password = req.body.password;
        
        const userFound = await this.user_service.filterUser({email: email});
        
        if (!userFound) return res.status(404).json({ message: "User Not Found" });
    
        if (!await this.user_service.validatePassword(password, userFound.password)) {
            return res.status(401).json({ token: null, message: "Invalid Password",});
        }
    
        const session = { 'id': userFound._id } as IJwtPayload;
    
        const token = jwt.sign(session, this._SECRET, {
            expiresIn: 86400, // 24 hours
        });
        
        console.log (token, userFound._id);
        return res.status(201).json({ token: token, id: userFound._id });
    };
    
}

