import * as mongoose from 'mongoose';

interface IPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface IActivity {
    _id?: mongoose.Types.ObjectId; // Optional _id field
    name: string;
    description: string; // Reference to description about activities
    rate?: Number;
    owner: mongoose.Types.ObjectId; //reference to list of users
    latitude: Number;
    longitude: Number;
    listUsers?: mongoose.Types.ObjectId[];
    comments?: mongoose.Types.ObjectId[];
    image?: string;
    date: Date;
    active: Boolean;
    location?: IPoint; // Nuevo parámetro de tipo Point para poder implementar la localización del evento.
}