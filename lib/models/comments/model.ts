import * as mongoose from 'mongoose';

export interface IComment {
    _id?: mongoose.Types.ObjectId;
    title: string;
    content: string;
    users: mongoose.Types.ObjectId;
    activities: mongoose.Types.ObjectId;
    review: number; 
}