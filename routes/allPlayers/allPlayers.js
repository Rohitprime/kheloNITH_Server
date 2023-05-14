
import express from 'express'

const allPlayersRoutes = express.Router()

import User from '../../models/user/user.js'

allPlayersRoutes.get('/kheloNITH/allPlayers',async(req,res)=>{
   
    const allUser = await User.find({}).populate('avtar')

    res.json({'allPlayers':allUser})

})


export default allPlayersRoutes