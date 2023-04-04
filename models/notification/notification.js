import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
    to:{type:Schema.Types.ObjectId,ref:'User'},
    from:{type:Schema.Types.ObjectId,ref:'User'},
    typeOfNotis:{type:String},
    date:{type:String},
    time:{type:String},
    apply:{type:Boolean},
    accept:{type:Boolean},
    reject:{type:Boolean},
    toNumber:{type:Number},
    fromNumber:{type:Number},
    event:{type:Schema.Types.ObjectId, ref:'SportEvents'},
    team:{type:Schema.Types.ObjectId,ref:'Team'},
    message:{type:String}
})

const Notifications = mongoose.model('Notifications',notificationSchema)

export default Notifications