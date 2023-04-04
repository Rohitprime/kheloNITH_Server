import { Router } from "express";
import SportEvents from "../../models/sportEvents/sportEvents.js";
import Team from "../../models/team/team.js";
import User from "../../models/user/user.js";

const specificRoutes = Router()

specificRoutes.get('/kheloNITH/specific/oneUser/:id',async(req,res)=>{
    const {id} = req.params
    try {
       const user = await User.findById(id).populate('events createdTeams inTeams avtar')
       res.json({user})
           
    } 
    catch (error) {
        res.json({'error':error.message})
    }
})

specificRoutes.get('/kheloNITH/specific/oneTeam/:id',async(req,res)=>{
    const {id} = req.params
    try {
          const team = await Team.findById(id)
          .populate({path:'teamLeader players',populate:{path:'avtar'}})
          res.json({team})    
    } 
    catch (error) {
        res.json({'error':error.message})
    }
})

specificRoutes.get('/kheloNITH/specific/oneEvent/:id',async(req,res)=>{
    const {id}=req.params
    try {
           const event = await SportEvents.findById(id).populate({path:'creater',populate:{path:'avtar'}})
           res.json({event})    
    }
     catch (error) {
        res.json({'error':error.message})
    }
})

export default specificRoutes