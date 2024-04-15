import * as mongoose from 'mongoose';

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: {
        first_name: String;
        middle_name: String;
        last_name: String;
    };
    email: String;
    phone_number: String;
    gender: String;
    activities?: mongoose.Types.ObjectId[]; // Array to store post IDs
    comments?: mongoose.Types.ObjectId[]; // Array to store post IDs
    active: Boolean;
}