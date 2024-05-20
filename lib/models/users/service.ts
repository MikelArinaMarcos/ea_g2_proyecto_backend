import ActivityService from '../activities/service';
import { IUser } from './model';
import users from './schema';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export default class UserService {



   public async encryptPassword(password:string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
      };
    
     public  validatePassword(password:string, person:string) {
        return bcrypt.compare(password, person);
      };

    public async createUser(user_params: IUser): Promise<IUser> {
        try {
            const session = new users(user_params);
            session.password= await this.encryptPassword(session.password)
    
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
            const activeQuery = { ...query, active: true };
            return await users.findOne(activeQuery);
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

    //Añadir actividad de usuario
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

    //Añadir actividad en el historial
    public async addActivityListToUser(userId: Types.ObjectId, activityId: Types.ObjectId): Promise<void> {
        try {
            // Retrieve the user document by ID
            const user = await users.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Add the post ID to the user's array of posts
            user.listActivities.push(activityId);

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


    public async getAll(query: any): Promise<IUser[] | null> {
        try {
            const activeQuery = { ...query, active: true };
            const usersWithPopulatedFields = await users.find(activeQuery);
    
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

    public async updateUserAfterCommentDeletion(userId: mongoose.Types.ObjectId, commentId: string): Promise<void> {
        try {
            // Encontrar la actividad asociada
            const user = await users.findById(userId);
            if (!user) {
                throw new Error('Activity not found');
            }
    
            // Eliminar el comentario de la lista de comentarios de la actividad
            user.comments = user.comments.filter(comment => !comment.equals(commentId));
    
            await user.save();

        } catch (error) {
            throw error;
        }
    }

}