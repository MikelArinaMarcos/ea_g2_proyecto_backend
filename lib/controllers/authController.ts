import { Request, Response } from 'express'
import jwt from "jsonwebtoken";

import users from '../models/users/schema';
import IJwtPayload from '../models/JWTPayload';

const _SECRET: string = 'api+jwt';


export async function signin(req: Request, res: Response): Promise<Response> {
    console.log('Log in');
    const email = req.body.email;
    const password = req.body.password;
    
    const userFound = await users.findOne({email: email});

    console.log(userFound);

    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    if (!await userFound.validatePassword(password)) {
        return res.status(401).json({ token: null, message: "Invalid Password",});
    }

    const session = { 'id': email } as IJwtPayload;

    const token = jwt.sign(session, _SECRET, {
        expiresIn: 86400, // 24 hours
    });
    
    console.log (token);
    return res.json(token);
};