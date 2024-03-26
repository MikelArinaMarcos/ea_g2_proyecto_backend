import { Request, Response } from 'express';
import { IActivity } from '../models/activities/model';
import ActivityService from '../models/activities/service';
import UserService from '../models/users/service';
import e = require('express');

export class ActivityController {

    private activity_service: ActivityService = new ActivityService();
    private user_service: UserService = new UserService();

    public async createActivity(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.name  && req.body.description && req.body.owner){
                const activity_params:IActivity = {
                    name: req.body.name,
                    rate: 0,
                    description: req.body.description,
                    owner: req.body.owner
                };
                const activity_data = await this.activity_service.createActivity(activity_params);
                await this.user_service.addActivityToUser(req.body.owner, activity_data._id);
                return res.status(201).json({ message: 'Activity created successfully', activity: activity_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getActivity(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const activity_filter = { _id: req.params.id };
                // Fetch user
                const post_data = await this.activity_service.filterActivity(activity_filter);
                // Send success response
                return res.status(200).json({ data: post_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async deleteActivity(req: Request, res: Response) {
        try {
            if (req.params.id) {
                // Delete post
                const delete_details = await this.activity_service.deleteActivity(req.params.id);
                if (delete_details.deletedCount !== 0) {
                    // Send success response if user deleted
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Post not found' });
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