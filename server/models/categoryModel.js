import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    type:{
        type:String,
        enum:["Expense","Income"],
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});

const Category = mongoose.model("Category",categorySchema);

export default Category;