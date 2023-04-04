import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true},
    hashPassword:{type:String,required:true},
    number:{type:Number,required:true},
    description:{type:String},
    avtar:{type:Schema.Types.ObjectId,ref:'Avtar'},
    events:[{type:Schema.Types.ObjectId,ref:'SportEvents'}],
    createdTeams:[{type:Schema.Types.ObjectId,ref:'Team'}],
    inTeams:[{type:Schema.Types.ObjectId,ref:'Team'}],
    notifications:[{type:Schema.Types.ObjectId,ref:'Notifications'}],
    progress:{
        numberOfEvents:{type:Number,default:0},
        request:{type:Number,default:0},
        acceptByOther:{type:Number,default:0},
        rejectedByOther:{type:Number,default:0},
        applied:{type:Number,default:0}
    }
})

const User = mongoose.model('User',userSchema)

export default User