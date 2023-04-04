import mongoose, { Schema } from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName:{type:String},
    type:{type:String},
    numberOfPlayers:{type:Number,required:true},
    teamLeader:{type:Schema.Types.ObjectId,ref:'User'},
    players:[{type:Schema.Types.ObjectId,ref:'User'}],
    date:{type:String},
    time:{type:String},
    letApply:{type:String},
    notifications:[{type:Schema.Types.ObjectId,ref:'Notifications'}]
})

const Team = mongoose.model('Team',teamSchema)

export default Team