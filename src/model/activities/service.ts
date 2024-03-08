import { IActivity } from './model';
import activities from './schema';

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

    public async deleteActivity(_id: string): Promise<{ deletedCount: number }> {
        try {
            const query = { _id: _id };
            return await activities.deleteOne(query);
        } catch (error) {
            throw error;
        }
    }
}