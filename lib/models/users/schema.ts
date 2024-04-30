import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

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

schema.methods.encryptPassword = async (password:string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };

  schema.methods.validatePassword = async function (password:string) {
    return bcrypt.compare(password, this.password);
  };

export default mongoose.model('users', schema);
