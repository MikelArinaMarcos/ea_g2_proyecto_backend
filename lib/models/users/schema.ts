import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
<<<<<<< HEAD
    name: String,
    email: String,
    phone_number: String,
    gender: String,
    birthday: Date,
    activities: [{ type: Schema.Types.ObjectId, ref: 'activities' }], 
    listActivities: [{ type: Schema.Types.ObjectId, ref: 'activities' }], //Lista de actividades en las que participa
    comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
    active: Boolean,
    password: String, // Add a 'password' field to store the hashed password´
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
      
    }
);
=======
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
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
});
>>>>>>> a7d8c88fab221218a965493d91adb5aa949d1081

export default mongoose.model('users', schema);
