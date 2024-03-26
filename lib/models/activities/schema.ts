import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  //avatar: { type: String, required: false },
  description: { type: String, required: false }, // Reference to the User model
  rate:{type: Number, required: false },
  owner:{type:Schema.Types.ObjectId, ref: 'users', required: true},
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }] 
});

export default mongoose.model('activities', schema);