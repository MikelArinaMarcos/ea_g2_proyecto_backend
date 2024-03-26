import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  //avatar: { type: String, required: false },
  Description: { type: String, required: false }, // Reference to the User model
  rate:{type: String, required: false },
  Owner:{type:Schema.Types.ObjectId, ref: 'users', required: true}
});

export default mongoose.model('activities', schema);