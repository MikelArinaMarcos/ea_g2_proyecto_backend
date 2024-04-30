import * as mongoose from 'mongoose';

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: String;
    email: String;
    phone_number: String;
    gender: String;
    birthday?: Date;
    activities?: mongoose.Types.ObjectId[]; // Array to store post IDs
    listActivities?: mongoose.Types.ObjectId[]; //Lista de actividades en las que participa
    comments?: mongoose.Types.ObjectId[]; // Array to store post IDs
    active: Boolean;
    password: String // Add a 'password' field to store the hashed password
}