import { IComment } from './model';
import comments from './schema';
import ActivityService from '../activities/service';
import UserService from '../users/service';

export default class CommentService {
  public async createComment(comment_params: IComment): Promise<IComment> {
    try {
      const session = new comments(comment_params);
      return await session.save();
    } catch (error) {
      throw error;
    }
  }

  public async filterComment(query: any): Promise<IComment | null> {
    try {
      return await comments.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  public async get5Comments(
    page: number,
    query: any
  ): Promise<IComment[] | null> {
    try {
      const activityComments = (
        await comments.find({ activities: query })
      ).reverse();
      return activityComments.slice(page * 5, 5 * (page + 1));
    } catch (error) {
      throw error;
    }
  }

  public async commentLength(query: any): Promise<number | null> {
    try {
      return (await comments.find({ activities: query })).length;
    } catch (error) {
      throw error;
    }
  }

  public async updateComment(
    comment_params: IComment,
    comment_id: any
  ): Promise<void> {
    try {
      await comments.findOneAndUpdate(comment_id, comment_params);

      const activityService = new ActivityService();
      await activityService.updateActivityRate(comment_params.activities);
    } catch (error) {
      throw error;
    }
  }

  public async deleteComment(_id: string): Promise<{ deletedCount: number }> {
    try {
      const comment = await comments.findOne({ _id });
      if (!comment) {
        throw new Error('Comment not found');
      }

      // Eliminar el comentario de la colección de comentarios
      const deletionResult = await comments.deleteOne({ _id });
      if (deletionResult.deletedCount !== 1) {
        throw new Error('Comment deletion failed');
      }

      // Actualizar la actividad asociada
      const activityService = new ActivityService();
      await activityService.updateActivityAfterCommentDeletion(
        comment.activities,
        _id
      );

      const userService = new UserService();
      await userService.updateUserAfterCommentDeletion(comment.users, _id);

      return deletionResult;
    } catch (error) {
      throw error;
    }
  }
}
