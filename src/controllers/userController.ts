import { Request, Response } from 'express';
import { IUser } from '../models/users/model';
import UserService from '../models/users/service';
import e = require('express');

export class UserController {

    private user_service: UserService = new UserService();

    public async create_user(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body._id && req.body.name && req.body.email && req.body.phone && req.body.date &&
                req.body.preferenceList) {
                const user_params: IUser = {
                    _id: req.body._id,
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    date: req.body.date,
                    preferenceList: req.body.preferenceList,
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

    public async get_user(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const user_filter = { _id: req.params.id };
                // Fetch user
                const user_data = await this.user_service.populateUserActivities(user_filter);
                // Send success response
                return res.status(200).json({ data: user_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async update_user(req: Request, res: Response) {
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
                    _id: req.params.id,
                    name: req.body.name, // Provide empty name object if not provided
                    email: req.body.email,
                    phone: req.body.phone,
                    date: req.body.date,
                    preferenceList: req.body.preferenceList
                };
                // Update user
                await this.user_service.updateUser(user_params);
                //get new user data
                const new_user_data = await this.user_service.filterUser(user_filter);
                // Send success response
                return res.status(200).json({ data: new_user_data, message: 'Successful'});
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
    
    

    public async delete_user(req: Request, res: Response) {
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