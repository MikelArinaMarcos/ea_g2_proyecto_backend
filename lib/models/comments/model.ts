import * as mongoose from 'mongoose';

export interface IComment {
    _id?: mongoose.Types.ObjectId;
    title: String;
    content: String;
    user: mongoose.Types.ObjectId;
    activity: mongoose.Types.ObjectId;
    review: number; // Array to store post IDs
}