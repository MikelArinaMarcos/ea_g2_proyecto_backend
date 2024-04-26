import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  //avatar: { type: String, required: false },
  description: { type: String, required: true }, // Reference to the User model
  rate:{type: Number, required: false },
  owner:{type:Schema.Types.ObjectId, ref: 'users', required: true},
  listUsers: [{type: Schema.Types.ObjectId, ref: 'users', required: false}],
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
  date: {type: Date, required: true},
  active: { type: Boolean, required: true }
});

export default mongoose.model('activities', schema);