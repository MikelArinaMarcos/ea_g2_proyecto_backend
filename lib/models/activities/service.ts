import { IComment } from 'models/comments/model';
import { IActivity } from './model';
import { IUser } from 'models/users/model';
import activities from './schema';
import comments from '../comments/schema';
import mongoose, { Types } from 'mongoose';

export default class ActivityService {
  public async createActivity(activity_params: IActivity): Promise<IActivity> {
    console.log('activity params', activity_params);
    const position = [];
    position.push(activity_params.location.coordinates[0]);
    position.push(activity_params.location.coordinates[1]);

    console.log('coordenades', position);
    try {
      const session = new activities(activity_params);
      return (await session.save()) as unknown as IActivity;
    } catch (error) {
      throw error;
    }
  }

  public async filterActivity(query: any): Promise<IActivity | null> {
    try {
      return (await activities
        .findOne(query)
        .exec()) as unknown as IActivity | null;
    } catch (error) {
      throw error;
    }
  }

  public async filterUserActivities(query: any): Promise<IActivity[] | null> {
    try {
      console.log(query);
      return (await activities
        .find({ owner: query, active: true })
        .exec()) as unknown as IActivity[] | null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async addCommentToActivity(
    activityId: Types.ObjectId,
    comment: IComment
  ): Promise<void> {
    try {
      const activity = await activities.findById(activityId).exec();
      if (!activity) {
        throw new Error('Activity not found');
      }
      const currentRate = activity.rate ? Number(activity.rate) : 0;
      const commentsCount = activity.comments.length;

      activity.rate =
        (commentsCount * currentRate + comment.review) / (commentsCount + 1);
      activity.comments.push(comment._id);

      await activity.save();
    } catch (error) {
      throw error;
    }
  }

  public async addListUsersToActivity(
    activityId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<void> {
    try {
      const activity = await activities.findById(activityId).exec();
      if (!activity) {
        throw new Error('Activity not found');
      }

      activity.listUsers.push(userId);

      await activity.save();
    } catch (error) {
      throw error;
    }
  }

  public async updateActivityAfterCommentDeletion(
    activityId: mongoose.Types.ObjectId,
    commentId: string
  ): Promise<void> {
    try {
      const activity = await activities.findById(activityId).exec();
      if (!activity) {
        throw new Error('Activity not found');
      }

      activity.comments = activity.comments.filter(
        (comment) => !comment.equals(commentId)
      );

      await activity.save();
      await this.updateActivityRate(activity._id);
    } catch (error) {
      throw error;
    }
  }

  public async updateActivityRate(
    activity_id: mongoose.Types.ObjectId
  ): Promise<void> {
    try {
      const activity = await this.filterActivity({ _id: activity_id });
      if (!activity) {
        throw new Error('Activity not found');
      }

      if (activity.comments.length > 0) {
        let totalRate = 0;
        for (const commentId of activity.comments) {
          const comment = await comments.findById(commentId).exec();
          if (comment) {
            totalRate += comment.review;
          }
        }
        activity.rate = totalRate / activity.comments.length;
      } else {
        activity.rate = 0;
      }

      await this.updateActivity(activity, { _id: activity_id });
    } catch (error) {
      throw error;
    }
  }

  public async updateActivity(
    activity_params: IActivity,
    activity_filter: any
  ): Promise<void> {
    try {
      await activities
        .findOneAndUpdate(activity_filter, activity_params)
        .exec();
    } catch (error) {
      throw error;
    }
  }

  public async updateActivitiesForDeletedUser(
    userId: mongoose.Types.ObjectId
  ): Promise<void> {
    try {
      const allActivities = await activities.find({ owner: userId }).exec();

      for (const activity of allActivities) {
        await activities
          .updateOne({ _id: activity._id }, { active: false })
          .exec();
      }
    } catch (error) {
      throw error;
    }
  }

  public async deleteActivity(
    _id: mongoose.Types.ObjectId
  ): Promise<{ deletedCount: number }> {
    try {
      const result = await activities
        .updateOne({ _id: _id }, { active: false })
        .exec();
      return { deletedCount: result.modifiedCount };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getAll(user: IUser, distance: number): Promise<IActivity[] | null> {
    try {
      return activities.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [user.location.coordinates[0], user.location.coordinates[1]] // User's coordinates
            },
            $maxDistance: distance // Specify the maximum distance (radius)
          }
        },
        active: true
      }) as unknown as
        | IActivity[]
        | null;
    } catch (error) {
      console.error('Error en getAll:', error);
      return null;
    }
  }
}
