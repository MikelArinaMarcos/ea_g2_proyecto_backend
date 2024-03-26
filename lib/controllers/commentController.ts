import { Request, Response } from 'express';
import { IComment } from '../models/comments/model';
import CommentService from '../models/comments/service';
import UserService from '../models/users/service';
import ActivityService from '../models/activities/service';
import e = require('express');

export class CommentController {

    private comment_service: CommentService = new CommentService();
    private user_service: UserService = new UserService();
    private activity_service: ActivityService = new ActivityService();

    public async createComment(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.title && req.body.content && req.body.user && req.body.activity && req.body.review) {
                const comment_params: IComment = {
                    title: req.body.title,
                    content: req.body.content,
                    users: req.body.user,
                    activities: req.body.activity,
                    review: req.body.review
                };
                const comment_data = await this.comment_service.createComment(comment_params);
                await this.user_service.addCommentToUser(req.body.user, comment_data._id);
                await this.activity_service.addCommentToActivity(req.body.activity, comment_data);
                return res.status(201).json({ message: 'Comment created successfully', comment: comment_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getComment(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const comment_filter = { _id: req.params.id };
                const comment_data = await this.comment_service.populateComment(comment_filter);
                // Send success response
                return res.status(200).json({ data: comment_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async updateComment(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const comment_filter = { _id: req.params.id };
                const comment_data = await this.comment_service.filterComment(comment_filter);
                if (!comment_data) {
                    return res.status(400).json({ error: 'Comment not found'});
                }
    
                const comment_params: IComment = {
                    title: req.body.title || comment_data.title,
                    content: req.body.content || comment_data.content,
                    users: req.body.user || comment_data.users,
                    activities: req.body.activity || comment_data.activities,
                    review: req.body.review || comment_data.review
                };
                await this.comment_service.updateComment(comment_params, comment_filter);
                const new_comment_data = await this.comment_service.filterComment(comment_filter);
                return res.status(200).json({ data: new_comment_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    

    public async deleteComment(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const delete_details = await this.comment_service.deleteComment(req.params.id);
                if (delete_details.deletedCount !== 0) {
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    return res.status(400).json({ error: 'Comment not found' });
                }
            } else {
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}