import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    date: { type: Date, required: true },
    prefereceList: [{ type: Schema.Types.ObjectId, ref: 'activities' }] // Array of ObjectIds referencing the Post model
    }
);

export default mongoose.model('users', schema);