import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    email: String, 
    role: String,
    question: Boolean,
    diagnoses: [String],
    registered: {
        type: Boolean, 
        default: false
    }

});

mongoose.model('User', UserSchema);
