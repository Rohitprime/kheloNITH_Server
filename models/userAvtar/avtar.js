
import mongoose from "mongoose";

const avtarSchema = mongoose.Schema({
    avtar:{type:String}
})

const Avtar = mongoose.model('Avtar',avtarSchema)

export default Avtar