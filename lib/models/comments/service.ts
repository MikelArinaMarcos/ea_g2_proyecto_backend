import { IComment } from './model';
import comments from './schema';
import { Types } from 'mongoose';

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

    public async updateComment(comment_params: IComment, comment_id: any): Promise<void> {
        try {
            await comments.findOneAndUpdate(comment_id, comment_params);
        } catch (error) {
            throw error;
        }
    }

    public async deleteComment(_id: string): Promise<{ deletedCount: number }> {
        try {
            const query = { _id: _id };
            return await comments.deleteOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async populateComment(query: any): Promise<IComment | null> {
        try {
            const comment = await comments.findOne(query).populate(['users', 'activities']).exec();
            if (!comment) {
                return null;
            }
            const populatedComment: IComment = {
                ...comment.toObject(),
                _id: comment._id
            };
            return populatedComment;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}