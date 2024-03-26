import * as mongoose from 'mongoose';

export interface IActivity {
    _id?: mongoose.Types.ObjectId; // Optional _id field
    name: string;
    //avatar?: String;
    Description?: String; // Reference to description about activities
    rate?: String;
    Owner: mongoose.Types.ObjectId; //reference to list of users
}