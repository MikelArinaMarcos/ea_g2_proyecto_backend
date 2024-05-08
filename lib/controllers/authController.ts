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
        console.log('Log in');
        const email = req.body.email;
        const password = req.body.password;
        
        const userFound = await users.findOne({email: email});
    
        console.log(userFound);
    
        if (!userFound) return res.status(400).json({ message: "User Not Found" });
    
        if (!await this.user_service.validatePassword(password,userFound.password)) {
            return res.status(401).json({ token: null, message: "Invalid Password",});
        }
    
        const session = { 'id': email } as IJwtPayload;
    
        const token = jwt.sign(session, this._SECRET, {
            expiresIn: 86400, // 24 hours
        });
        
        console.log (token);
        return res.json(token);
    };
    
    public async signup(req: Request, res: Response): Promise<Response> {
        /* //const { username, email, password, rol } = req.body;
        const { name, email, phone_number, gender, password } = req.body;
        console.log(name, email, phone_number,gender, password);
    
        const user = new users({
            name,
            email,
            phone_number,
            gender,
            password,
            active: true
        });
    
        //user.role = 'public';
    
        user.password = await user_service.encryptPassword(user.password);
        await user.save();
    
        // Ahora, después de registrarse, generamos un token y lo devolvemos
        /*
        const token = jwt.sign({ id: user._id, rol: user.rol }, config.secret, {
            expiresIn: 60 * 60 * 24
        });
        
        //Creamos el token
        const token = jwt.sign({ id: user._id }, _SECRET, {
            expiresIn: 60 * 60 * 24
        });
    
        return res.status(200).json({ auth: true, token }); */
        try{
            if (req.body.name && req.body.email && req.body.phone_number  && req.body.gender && req.body.password) {
                const user_params: IUser = {
                    name: req.body.name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    gender: req.body.gender,
                    //birthday: req.body.birthday,
                    active: true,
                    password: req.body.password
                };
                const user_data = await this.user_service.createUser(user_params);
                const token = jwt.sign({ id: user_params._id }, this._SECRET, {
                    expiresIn: 60 * 60 * 24
                });
            
                return res.status(200).json({ auth: true, token, message: 'User created successfully', user: user_data  });
                
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            console.log("error", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}