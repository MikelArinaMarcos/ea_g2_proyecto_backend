import * as mongoose from 'mongoose';

export interface IActivity {
    _id?: mongoose.Types.ObjectId; // Optional _id field
    name: string;
    avatar?: string;
    idDescription?: mongoose.Types.ObjectId; // Reference to description about activities
    rate: String;
    listUser: mongoose.Types.ObjectId; //reference to list of users
}