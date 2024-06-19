import * as mongoose from 'mongoose';
import { randomBytes } from 'crypto';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone_number: String,
  gender: String,
  birthday: Date,
  activities: [{ type: Schema.Types.ObjectId, ref: 'activities' }],
  listActivities: [{ type: Schema.Types.ObjectId, ref: 'activities' }], // Lista de actividades en las que participa
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
  active: Boolean,
  image: { type: String, required: false },
  password: { type: String, required: true }, // Campo para almacenar la contraseña cifrada
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Método para generar el token de recuperación de contraseña
userSchema.methods.generatePasswordResetToken = function (): string {
  const token = randomBytes(20).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  return token;
};

// Método para validar el token de recuperación de contraseña
userSchema.methods.validatePasswordResetToken = function (token: string): boolean {
  return token === this.resetPasswordToken && Date.now() < this.resetPasswordExpires;
};

export default mongoose.model('users', userSchema);
