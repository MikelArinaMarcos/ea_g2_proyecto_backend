import { IComment } from 'models/comments/model';
import { IActivity } from './model';
import activities from './schema';
import { Types } from 'mongoose';

export default class ActivityService {
    
    public async createActivity(activity_params: IActivity): Promise<IActivity> {
        try {
            const session = new activities (activity_params);
            return await session.save();
        } catch (error) {
            throw error;
        }
    }

    public async filterActivity(query: any): Promise<IActivity | null> {
        try {
            return await activities.findOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async getAll(query: any): Promise<IActivity[] | null> {
        // Find the user document and populate the 'posts' field
        return await activities.find(query);
}

    public async addCommentToActivity(activityId: Types.ObjectId, comment: IComment): Promise<void> {
        try {
            // Retrieve the user document by ID
            const activity = await activities.findById(activityId);
            if (!activity) {
                throw new Error('Activity not found');
            }
            activity.rate = (((activity.comments.length * activity.rate) + comment.review) / (activity.comments.length + 1));
            // Add the post ID to the user's array of posts
            activity.comments.push(comment._id);
            

            // Save the updated user document
            await activity.save();
        } catch (error) {
            throw error;
        }
    }

    public async deleteActivity(_id: string): Promise<{ deletedCount: number }> {
        try {
            const query = { _id: _id };
            return await activities.deleteOne(query);
        } catch (error) {
            throw error;
        }
    }
}