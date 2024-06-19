import * as mongoose from 'mongoose';

interface IPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  birthday?: Date;
  activities?: mongoose.Types.ObjectId[]; // Array to store post IDs
  listActivities?: mongoose.Types.ObjectId[]; // Lista de actividades en las que participa
  comments?: mongoose.Types.ObjectId[]; // Array to store post IDs
  active: boolean;
  image?: string;
  password: string; // Campo para almacenar la contraseña cifrada
  location?: IPoint;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  generatePasswordResetToken(): string;
  validatePasswordResetToken(token: string): boolean;
}