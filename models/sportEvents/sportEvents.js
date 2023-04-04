import mongoose, { Schema } from "mongoose"

const sportEventsSchema = new mongoose.Schema({
    type:{type:String,required:true},
    date:{type:String,required:true},
    time:{type:String,required:true},
    creater:[{type:Schema.Types.ObjectId,ref:'User'}],
    notifications:[{type:Schema.Types.ObjectId,ref:'Notifications'}],
    
})

const SportEvents = mongoose.model('SportEvents',sportEventsSchema)

export default SportEvents