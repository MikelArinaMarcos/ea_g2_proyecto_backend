import ActivityService from '../activities/service';
import { IUser } from './model';
import users from './schema';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';

export default class UserService {

    
    public async createUser(user_params: IUser): Promise<IUser> {
        try {
            const session = new users(user_params);
            const result = await session.save();
            // Convert _id to string
            const newUser: IUser = { ...result.toObject(), _id: result._id };
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    public async filterUser(query: any): Promise<IUser | null> {
        try {
            return await users.findOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async updateUser(user_params: IUser, user_filter: any): Promise<void> {
        try {
            await users.findOneAndUpdate(user_filter, user_params);
        } catch (error) {
            throw error;
        }
    }

    public async deleteUser(_id: string): Promise<{ deletedCount: number }> {
        try {
            
            const activityService = new ActivityService();
            await activityService.updateActivitiesForDeletedUser(_id);

            // Luego, eliminar al usuario
            const query = { _id: _id };
            const update = { active: false };
            const result = await users.updateOne(query, update);

      return { deletedCount: result.modifiedCount };
        } catch (error) {
            throw error;
        }
    }

    public async addActivityToUser(userId: Types.ObjectId, activityId: Types.ObjectId): Promise<void> {
        try {
            // Retrieve the user document by ID
            const user = await users.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Add the post ID to the user's array of posts
            user.activities.push(activityId);

            // Save the updated user document
            await user.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async addCommentToUser(userId: Types.ObjectId, commentId: Types.ObjectId): Promise<void> {
        try {
            // Retrieve the user document by ID
            const user = await users.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Add the post ID to the user's array of posts
            user.comments.push(commentId);
            // Save the updated user document
            await user.save();
        } catch (error) {
            throw error;
        }
    }

   /*  public async getUser(query: any): Promise<IUser[] | null> {

        
        // Find the user document and populate the 'posts' field
        return await users.aggregate([
            {
                $match:{}
            },
            {$facet:
            metaData:[],
            },
            {$skip:(page-1)*limit},

        ]);
} */

    public async getAll(query: any): Promise<IUser[] | null> {
        try {
            const activeQuery = { ...query, active: true };
            const usersWithPopulatedFields = await users.find(activeQuery)
                .populate('activities')
                .populate('comments') // Add population for 'comments' field
                .exec();
    
            const populatedUsers: IUser[] = usersWithPopulatedFields.map(user => ({
                ...user.toObject(),
                _id: user._id
            }));
    
            return populatedUsers;
        } catch (error) {
            console.error("Error fetching and populating users:", error);
            return null;
        }
    }
    
    public async populateUserActivity(query: any): Promise<IUser | null> {
        try {
            const user = await users.findOne(query)
                .populate('activities')
                .populate('comments') // Add population for 'comments' field
                .exec();
    
            if (!user) {
                return null;
            }
    
            const populatedUser: IUser = {
                ...user.toObject(),
                _id: user._id
            };
    
            return populatedUser;
        } catch (error) {
            console.error("Error fetching and populating user activity:", error);
            return null;
        }
    }

}