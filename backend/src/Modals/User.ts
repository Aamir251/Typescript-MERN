import mongoose from 'mongoose';

const user = new mongoose.Schema({
    username : {
        type : String,
        unique : true
    },
    password : {
        type : String,
    },
    isAdmin : {
        type : Boolean,
        default : false
    }
});

// The one inside "" is the name of our Model, and second one specifies what exactly does our Model refers to;
export default mongoose.model("User", user)