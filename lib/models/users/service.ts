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
            const query = { _id: _id };
            return await users.deleteOne(query);
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
            throw error;
        }
    }

    public async getAll(query: any): Promise<IUser[] | null> {
            // Find the user document and populate the 'posts' field
            return await users.find(query);
    }

    public async populateUserActivity(query: any): Promise<IUser | null> {
        try {
            try{
                const user = await users.findOne(query).populate('activities').exec();
                if (!user) {
                    return null;
                }
                // Convert _id to string
                const populatedUser: IUser = {
                    ...user.toObject(),
                    _id: user._id
                };
                return populatedUser;
            }catch(error){
                return null;
            }
        } catch (error) {
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

}