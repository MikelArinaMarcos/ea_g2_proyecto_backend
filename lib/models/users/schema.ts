import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  email: String,
  phone_number: String,
  gender: String,
  birthday: Date,
  activities: [{ type: Schema.Types.ObjectId, ref: 'activities' }],
  listActivities: [{ type: Schema.Types.ObjectId, ref: 'activities' }], //Lista de actividades en las que participa
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
  active: Boolean,
  image: { type: String, required: false },
  password: String, // Add a 'password' field to store the hashed password
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: false
    }
  }
});

export default mongoose.model('users', schema);
