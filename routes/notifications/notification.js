import { Router } from "express";
import jwt from 'jsonwebtoken'
import Notifications from "../../models/notification/notification.js";
import SportEvents from "../../models/sportEvents/sportEvents.js";
import User from "../../models/user/user.js";
import dateAndTime from '../../utils/dateAndTimefun.js'
import sendMail from "../../controller/sendEmail.js";
import env from "../../config.js";

const notificationsRoutes = Router()

notificationsRoutes.post('/kheloNITH/notifications/event/apply',async(req,res)=>{

     const {token,id} = req.body
     const {cdate,ctime} = dateAndTime()
     try {
        const verifidUser =  jwt.verify(token,env.jwtSecretKey)
        const from = await User.findOne({email:verifidUser.email})   
        const event = await SportEvents.findById(id).populate('creater')
        const to = event.creater[0]

        if(cdate > event.date){
            res.json({'error':'Event has been ended'})
        }
        if(to.email === from.email){
            return res.json({'error':"You can't play with yourself :)"})
        }

        const avaliableNotification =await Notifications.findOne({event,to,from})
        if(avaliableNotification){
            return res.json({'error':'You have already applied for this event'})
        }

        const notification = await Notifications({date:cdate,time:ctime,typeOfNotis:'event'})
        notification.to = to._id
        notification.from = from._id
        notification.event = event._id
        notification.apply = true
        to.notifications.push(notification._id)
        to.progress.request =  to.progress.request+1
        await to.save()
        from.notifications.push(notification._id)
        from.progress.applied+=1
        await from.save()
        event.notifications.push(notification._id)
        await event.save()
        await  notification.save()
        res.json({'message':`Applied succesfully `})
        sendMail(`${from.name} has challenged you for your ${event.type} event`,`${to.email}`,`${to.name}`,`About your event`)
     }
      catch (error) {
        res.json({'error':error.message})
     }
})


notificationsRoutes.get('/kheloNITH/notification/event/reject/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const notification = await Notifications.findById(id).populate('from event')
        const to = await User.findById(notification.to._id)
        const from = await User.findById(notification.from._id)
        notification.reject = true
        notification.apply = true
        notification.accept = false
        notification.toNumber = ''
        notification.fromNumber = ''
        await notification.save()
        from.progress.rejectedByOther+=1
        await from.save()
        res.json({'message':`You have rejected to ${notification.from.name} `})   
        sendMail(`${to.name} has rejected your challenge for ${notification.event.type} event`,`${from.email}`,`${from.name}`
        ,'About challenge')
 
    } 
    catch (error) {
        res.json({'error':error.message})
    }
})

notificationsRoutes.get('/kheloNITH/notification/event/accept/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const notification = await Notifications.findById(id).populate('from event')
        const to = await User.findById(notification.to._id)
        const from = await User.findById(notification.from._id)
        notification.accept = true
        notification.apply = false
        notification.toNumber = to.number
        notification.fromNumber = from.number
        await notification.save()
        from.progress.acceptByOther+=1
        await from.save()
        res.json({'message':`You have Accept the challenge from ${notification.from.name} `})    
        sendMail(`${to.name} has accepted your challenge for ${notification.event.type} event`,`${from.email}`,`${from.name}`
        ,'About your challenge')

    } 
    catch (error) {
        res.json({'error':error.message})
    }
})


notificationsRoutes.get('/kheloNITH/notification/event/cancel/:id',async(req,res)=>{
    const {id}= req.params
    try {
        
        const notification = await Notifications.findById(id).populate('to from')
        const to =notification.to
        const from = notification.from

        const toIdIndex = to.notifications.indexOf(id)
        to.notifications.splice(toIdIndex,1)
        await to.save()
        const fromIdIndex = from.notifications.indexOf(id)
        from.notifications.splice(fromIdIndex,1)
        await from.save()

        await Notifications.findByIdAndDelete(id)

        res.json({'message':'cancelled challenge succesfully'})
    } 
    catch (error) {
        res.json({'error':error.message}) 
    }
})

export default notificationsRoutes