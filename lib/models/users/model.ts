import * as mongoose from 'mongoose';

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone_number: string;
    gender: string;
    birthday?: Date;
    activities?: mongoose.Types.ObjectId[]; // Array to store post IDs
    listActivities?: mongoose.Types.ObjectId[]; //Lista de actividades en las que participa
    comments?: mongoose.Types.ObjectId[]; // Array to store post IDs
    active: Boolean;
    password: string // Add a 'password' field to store the hashed password
}