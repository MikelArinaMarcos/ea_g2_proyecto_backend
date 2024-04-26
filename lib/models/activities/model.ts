import * as mongoose from 'mongoose';

export interface IActivity {
    _id?: mongoose.Types.ObjectId; // Optional _id field
    name: string;
    description: String; // Reference to description about activities
    rate?: Number;
    owner: mongoose.Types.ObjectId; //reference to list of users
    listUsers?: mongoose.Types.ObjectId[];
    comments?: mongoose.Types.ObjectId[];
    date: Date;
    active: Boolean;
}