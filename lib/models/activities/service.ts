import { IComment } from 'models/comments/model';
import { IActivity } from './model';
import activities from './schema';
import { Types } from 'mongoose';
import { compileFunction } from 'vm';
import { IUser } from 'models/users/model';

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
            const update = { active: false };
            const result = await activities.updateOne(query, update);
            return { deletedCount: result.modifiedCount };
        } catch (error) {
            throw error;
        }
    }

    public async getAll(query: any): Promise<IActivity[] | null> {
        try {
            // Agrega la condición para que solo devuelva actividades con propietario activo
            const activeQuery = { ...query, active: true };
            const activity = await activities.find(activeQuery)
                .populate('owner') 
                .exec();
    
            // Filtra las actividades para que solo devuelva aquellas con propietario activo
            const filteredActivities = activity.filter((activity:any) => {
                return activity.owner && activity.owner.active; // Verifica que el propietario esté populated y es activo
            });
    
            return filteredActivities;
        } catch (error) {
            console.error("Error en getAll:", error);
            return null;
        }
    }

    public async populateActivityCommentsUser(query: any): Promise<IActivity | null> {
        try{
            const activity = await activities.findOne(query)
            .populate({
                path: 'comments',
                populate: { path: 'users' }, 
            })
            .populate({
                path: 'owner'
            })
            .exec();

            if (!activity) {
                return null;
            }

            activity.comments = activity.comments.filter((comment: any) => {
                return comment.users && comment.users.active; // Verifica que el usuario esté populated y es activo
            });;

            const populatedActivity: IActivity = {
                ...activity.toObject(),
                _id: activity._id
            };

            return populatedActivity;
        }catch(error){
            return null;
        }
    }
}