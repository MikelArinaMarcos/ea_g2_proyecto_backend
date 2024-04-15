import { Request, Response } from 'express';
import { IUser } from '../models/users/model';
import UserService from '../models/users/service';
import e = require('express');
import * as mongoose from 'mongoose';

export class UserController {

    private user_service: UserService = new UserService();

    public async createUser(req: Request, res: Response) {
        try{
            if (req.body.name && req.body.name.first_name && req.body.name.middle_name && req.body.name.last_name && req.body.email && req.body.phone_number && req.body.gender) {
                const user_params: IUser = {
                    name: {
                        first_name: req.body.name.first_name,
                        middle_name: req.body.name.middle_name,
                        last_name: req.body.name.last_name
                    },
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    gender: req.body.gender,
                    active: true
                };
                const user_data = await this.user_service.createUser(user_params);
                return res.status(201).json({ message: 'User created successfully', user: user_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getAll(req: Request, res: Response) {
        try {
            console.log("funciona get all");
            const user_filter = {};
            const user_data = await this.user_service.getAll(user_filter);
            let total=user_data.length;
            
            const page = Number(req.params.page); // Convertir a número
            const limit = Number(req.params.limit); // Convertir a número
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            let totalPages= Math.ceil(total/limit);
    
            console.log(user_data,"esto es el user_data");
            const resultUser = user_data.slice(startIndex, endIndex);
            console.log(startIndex,endIndex); 
            console.log(resultUser);
            console.log("numero de usurarios:",total);
            console.log("Numero de paginas:",totalPages);
            return res.status(200).json({users:resultUser,totalPages:totalPages,totalUser:total});
            //return res.status(200).json(resultUser);
        } catch (error) {
            
            console.error('Error en la solicitud:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    public async getUser(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const user_filter = { _id: req.params.id };
                // Fetch user
                const user_data = await this.user_service.populateUserActivity(user_filter);
                // Send success response
                return res.status(200).json({ data: user_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async updateUser(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const user_filter = { _id: req.params.id };
                // Fetch user
                const user_data = await this.user_service.filterUser(user_filter);
                if (!user_data) {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'User not found'});
                }
    
                const user_params: IUser = {
                    name: req.body.name ? {
                        first_name: req.body.name.first_name || user_data.name?.first_name,
                        middle_name: req.body.name.middle_name || user_data.name?.middle_name,
                        last_name: req.body.name.last_name || user_data.name?.last_name
                    } : user_data.name || { first_name: '', middle_name: '', last_name: '' }, // Provide empty name object if not provided
                    email: req.body.email || user_data.email,
                    phone_number: req.body.phone_number || user_data.phone_number,
                    gender: req.body.gender || user_data.gender,
                    active: true
                };
                await this.user_service.updateUser(user_params, user_filter);
                //get new user data
                const new_user_data = await this.user_service.filterUser(user_filter);
                // Send success response
                return res.status(200).json({ data: new_user_data, message: 'Successful update'});
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            // Catch and handle any errors
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    

    public async deleteUser(req: Request, res: Response) {
        try {
            if (req.params.id) {
                // Delete user
                const delete_details = await this.user_service.deleteUser(req.params.id);
                if (delete_details.deletedCount !== 0) {
                    // Send success response if user deleted
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'User not found' });
                }
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            // Catch and handle any errors
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}