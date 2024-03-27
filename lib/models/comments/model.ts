import * as mongoose from 'mongoose';

export interface IComment {
    _id?: mongoose.Types.ObjectId;
    title: String;
    content: String;
    users: mongoose.Types.ObjectId;
    activities: mongoose.Types.ObjectId;
    review: number; 
}