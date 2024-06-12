import * as mongoose from 'mongoose';

interface IPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IActivity {
  _id?: mongoose.Types.ObjectId; // Optional _id field
  name: string;
  description: string; // Reference to description about activities
  rate?: number;
  owner: mongoose.Types.ObjectId; //reference to list of users
  latitude: number;
  longitude: number;
  listUsers?: mongoose.Types.ObjectId[];
  comments?: mongoose.Types.ObjectId[];
  image?: string;
  date: Date;
  active: boolean;
  location?: IPoint; // Nuevo parámetro de tipo Point para poder implementar la localización del evento.
}
