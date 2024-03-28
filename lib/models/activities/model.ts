import * as mongoose from 'mongoose';

export interface IActivity {
    _id?: mongoose.Types.ObjectId; // Optional _id field
    name: string;
    //avatar?: String;
    description: String; // Reference to description about activities
    rate?: Number;
    owner: mongoose.Types.ObjectId; //reference to list of users
    comments?: mongoose.Types.ObjectId[];
    active: Boolean;
}