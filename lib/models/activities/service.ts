import { IComment } from 'models/comments/model';
import { IActivity } from './model';
import activities from './schema';
import comments from '../comments/schema';
import mongoose, { Types } from 'mongoose';
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

    public async updateActivityAfterCommentDeletion(activityId: mongoose.Types.ObjectId, commentId: string): Promise<void> {
        try {
            // Encontrar la actividad asociada
            const activity = await activities.findById(activityId);
            if (!activity) {
                throw new Error('Activity not found');
            }
    
            // Eliminar el comentario de la lista de comentarios de la actividad
            activity.comments = activity.comments.filter(comment => !comment.equals(commentId));
    
            await activity.save();
            await this.updateActivityRate(activity._id)

        } catch (error) {
            throw error;
        }
    }

    public async updateActivityRate(activity_id: any): Promise<void> {
        
        try {
            // Obtener la actividad
            const activity = await this.filterActivity({ _id: activity_id });
            if (!activity) {
                throw new Error('Activity not found');
            }
    
            // Verificar si hay comentarios
            if (activity.comments.length > 0) {
                let totalRate = 0;
                for (const commentId of activity.comments) {
                    const comment = await comments.findById(commentId);
                    if (comment) {
                        totalRate += comment.review;
                    }
                }
                // Calcular el nuevo rating
                activity.rate = totalRate / activity.comments.length;
            } else {
                activity.rate = 0; // Si no hay comentarios, establecer el rating a 0
            }
    
            // Actualizar la actividad con el nuevo rating
            await this.updateActivity(activity, { _id: activity_id });
        } catch (error) {
            throw error;
        }
    }

    public async updateActivity(activity_params: IActivity, activity_filter: any): Promise<void> {
        try {
            await activities.findOneAndUpdate(activity_filter, activity_params);
        } catch (error) {
            throw error;
        }
    }

    public async updateActivitiesForDeletedUser(userId: string): Promise<void> {
        try {
          // Encontrar todas las actividades del usuario
          const allactivities = await activities.find({ owner: userId });
    
          // Actualizar cada actividad para que active = false
          for (const activity of allactivities) {
            await activities.updateOne({ _id: activity._id }, { active: false });
          }
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
                .populate('comments')
                .populate('owner') 
                .exec();
    
            return activity;
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