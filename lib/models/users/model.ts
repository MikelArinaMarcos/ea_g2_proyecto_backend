import * as mongoose from 'mongoose';

interface IPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IUser {
<<<<<<< HEAD
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
    location?: IPoint;
    
}
=======
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  birthday?: Date;
  activities?: mongoose.Types.ObjectId[]; // Array to store post IDs
  listActivities?: mongoose.Types.ObjectId[]; //Lista de actividades en las que participa
  comments?: mongoose.Types.ObjectId[]; // Array to store post IDs
  active: boolean;
  image?: string;
  password: string; // Add a 'password' field to store the hashed password
  location?: IPoint;
}
>>>>>>> a7d8c88fab221218a965493d91adb5aa949d1081
