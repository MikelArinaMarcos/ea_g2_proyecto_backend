import * as mongoose from 'mongoose';

export interface IActivity {
    //_id?: String; // Optional _id field
    name: string;
    //avatar?: String;
    //idDescription?: mongoose.Types.ObjectId; // Reference to description about activities
    rate: String;
    listUser: mongoose.Types.ObjectId; //reference to list of users
}