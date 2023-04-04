
import { Router } from "express";
import jwt from 'jsonwebtoken'
import User from "../../models/user/user.js";
import Avtar from "../../models/userAvtar/avtar.js";
import env from "../../config.js";



const profileRouter = Router()

profileRouter.post('/kheloNITH/profile', async (req, res) => {

  const { token } = req.body
  try {
    const verified = jwt.verify(token,env.jwtSecretKey)
    const user = await User.findOne({ email: verified.email }).populate('events createdTeams inTeams avtar').select('-hashPassword')
    .populate({path:'notifications',populate:{path:'from event to team'}})
    
    res.json({ 'message': 'Welcome', user })
  }
  catch (e) {
    res.json({ 'error': 'Verification failed! Login first'  })
  }


})



profileRouter.post('/kheloNITH/profile/edit', async(req,res)=>{
  
  const {user} = req.body
  try {
    if(user.newAvtar){
      await Avtar.findByIdAndDelete(user.avtar._id)
      const avtarOfUser = await Avtar({avtar:user.newAvtar})
      await avtarOfUser.save()
      const updatedUser = await User.findByIdAndUpdate(user._id,{...user,avtar:avtarOfUser._id})
      await updatedUser.save()
    }
    else if(!user.newAvtar){
      const updatedUser = await User.findByIdAndUpdate(user._id,{...user})
      await updatedUser.save()
    }

    res.json({'message':'profile successfully updated'})
  } 
  catch (error) {
    res.json({'error':error.message})
  }
})

export default profileRouter