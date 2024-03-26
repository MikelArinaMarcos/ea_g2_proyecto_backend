import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    users: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    activities: {type: Schema.Types.ObjectId, ref: 'activities', required: true},
    review: { type: Number, required: true} // Array of ObjectIds referencing the Activity model
    }
);

export default mongoose.model('comments', schema);