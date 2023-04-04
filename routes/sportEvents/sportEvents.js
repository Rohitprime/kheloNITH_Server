import { Router } from "express";
import jwt from 'jsonwebtoken'
import Notifications from "../../models/notification/notification.js";
import SportEvents from "../../models/sportEvents/sportEvents.js";
import User from "../../models/user/user.js";
import dateAndTime from "../../utils/dateAndTimefun.js";
import sendMail from "../../controller/sendEmail.js";
import env from "../../config.js";

const sportEventsRoute = Router()


sportEventsRoute.post('/kheloNITH/createSportEvents',async(req,res)=>{
    const {cdate,ctime} = dateAndTime()
    const {token,type,date,time} = req.body
    if(cdate>date){
       return res.json({'error':'date is not valid'})
    }
    if(cdate==date &&  ctime>time){
        return res.json({'error':'time is not valid'}) 
    }

    try {
        const user = jwt.verify(token,env.jwtSecretKey)     
        const creater =await User.findOne({email:user.email})
        const event =await SportEvents({
            type,
            date,
            time,
        })
        event.creater.push(creater._id)
        await event.save()
        creater.events.push(event._id)
        creater.progress.numberOfEvents +=1
        await creater.save()
        res.json({"message":'event created succesfull'})
        const allUser = await User.find({})
        let allMail =' '
        // for(let i=0;i<allUser.length; i++){
        //     allMail = `${allUser[i].email}, `+allMail
        //     if(i+1==allUser.length){
        //         sendMail(`${creater.name} has created a new ${event.type} event. Be the first to apply`,
        //         allMail,
        //         'Player',
        //         'About new event')
        //     }
        // }
        
    } 
    catch (error) {
        res.json({'error':error.message})
    }
})

sportEventsRoute.post('/kheloNITH/SportEvent/deleteEvent', async (req, res) => {

    const { id, token } = req.body
    try {
      const verifiedUser = jwt.verify(token, env.jwtSecretKey)
      const creater = await User.findOne({ email: verifiedUser.email }).populate('notifications')    
      
          const event = await SportEvents.findById(id).populate('notifications')
          const notifications = event.notifications
          const notiLength = notifications.length
          let i=0
         for(const notification of notifications){
                i++
             
               const from = notification.from
               const fromUser = await User.findById(from._id)
               const fromNotiIdIndex = fromUser.notifications.indexOf(notification)
               fromUser.notifications.splice(fromNotiIdIndex,1)
               await fromUser.save()
               const toNotiIdIndex = creater.notifications.indexOf(notification)
               creater.notifications.splice(toNotiIdIndex,1)
               await creater.save()
               await Notifications.findByIdAndDelete(notification._id)

            }       
          
            if(i==notiLength){
             
               const deletedEvents = await SportEvents.findByIdAndDelete(id)
               res.json({ 'message': 'Event Deleted Succesfully' })
            }
    }
    catch (error) {
      res.json({ 'error': error.message })
    }
  })


sportEventsRoute.post('/kheloNITH/oneEvent/update',async(req,res)=>{
    
    const {date,time,id} = req.body
    const {cdate,ctime} = dateAndTime()

    if(cdate>date){
        return res.json({'error':'date is not valid'})
     }
     if(cdate==date &&  ctime>time){
         return res.json({'error':'time is not valid'}) 
     }
 
     try {
         const event =await SportEvents.findById(id)
         event.time=time
         event.date = date
         await event.save()
         res.json({"message":'event update succesfull'})
         
     } 
     catch (error) {
         res.json({'error':error.message})
     }
})


sportEventsRoute.get('/kheloNITH/getSportEvents',async(req,res)=>{
    try {
         const events = await SportEvents.find({}).populate({path:'creater',populate:{path:'avtar'}})
         res.json({events})
    } 
    catch (error) {
        res.json({'error':error.message}) 
    }
})

export default sportEventsRoute