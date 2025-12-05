import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId:{
        type:String,
        unique:true,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    sessionId:{
        type:String,
        default:null,
    },
    token:{
        type:String,
        default:null,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    updatedAt:{
        type:Date,
        default:Date.now(),
    }
})

const User = mongoose.model("User",userSchema);

export default User;