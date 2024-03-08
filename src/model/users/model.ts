import * as mongoose from 'mongoose';

export interface IUser {
    _id?: String;
    name: String;
    email: String;
    phone_number: String;
    date: Date;
    preferenceList?: mongoose.Types.ObjectId[]; // Array to store post IDs
}