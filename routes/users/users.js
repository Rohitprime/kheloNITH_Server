import { Router } from "express";
import User from "../../models/user/user.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import firstLaterUppercase from "../../utils/firstLaterUpperccase.js";
import Avtar from "../../models/userAvtar/avtar.js";
import env from "../../config.js";
const userRoutes = Router()

userRoutes.post('/kheloNITH/register',async(req,res)=>{
    // console.log(req.body)
   try {

     const {name,email,password,number,avtar} = req.body;
     const findUser = await User.findOne({email})
     if(findUser){
      return res.json({'error':'Player Already Exist'})
     }
     const hashPassword = await bcrypt.hash(password,10);
     const upperCaseName = firstLaterUppercase(name)
     const user = await User({name:upperCaseName,email,hashPassword,number})
     if(avtar){
      const avtarOfuser = await Avtar({avtar})
      await avtarOfuser.save()
      user.avtar = avtarOfuser._id
     }
     await user.save()
     const token =  jwt.sign({email,password},env.jwtSecretKey,{expiresIn:'5h'})
     res.json({'message':'user created succesfully',token})
   } catch (e) {
    res.json({'error':'somthing went wrond ! please try again'})
   }
})

userRoutes.post('/kheloNITH/login',async(req,res)=>{
//    console.log(req.body)
   try{
     const {email,password} = req.body
     const user = await User.findOne({email})
     if(user && await bcrypt.compare(password,user.hashPassword)){
     
     const token =  jwt.sign({email,password},env.jwtSecretKey,{expiresIn:'5h'})
     res.json({'message':'login succesfully',token})
     }
     else{
        res.json({error:'login failed ! Email or Password is wrong'})
     }
   }
   catch(e){
    res.json({'error':e.message}) 
   }
})

export default userRoutes