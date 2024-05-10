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
    password: String // Add a 'password' field to store the hashed password
    }
);

export default mongoose.model('users', schema);
