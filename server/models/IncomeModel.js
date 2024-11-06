import mongoose from "mongoose";
import Category from "./categoryModel.js";

const incomeSchema = mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
})

const Income = mongoose.model("Income",incomeSchema);

export default Income;