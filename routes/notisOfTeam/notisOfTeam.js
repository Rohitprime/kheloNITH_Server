import { Router } from "express";
import jwt from 'jsonwebtoken'
import Notifications from "../../models/notification/notification.js";
import User from "../../models/user/user.js";
import dateAndTime from '../../utils/dateAndTimefun.js'
import sendMail from "../../controller/sendEmail.js";
import Team from "../../models/team/team.js";
import env from "../../config.js";

const notisOfTeamRoutes = Router()

notisOfTeamRoutes.post('/kheloNITH/notifications/team/apply',async(req,res)=>{

     const {token,id} = req.body
     const {cdate,ctime} = dateAndTime()
     try {
        const verifidUser =  jwt.verify(token,env.jwtSecretKey)
        const from = await User.findOne({email:verifidUser.email})   
        const team = await Team.findById(id).populate('teamLeader')
        const to = team.teamLeader

        
        if(to.email === from.email){
            return res.json({'error':"You are already in this team :)"})
        }

        const avaliableNotification =await Notifications.findOne({team,to,from})
        if(avaliableNotification){
            return res.json({'error':'You have already applied for a position, in this team'})
        }

        const notification = await Notifications({date:cdate,time:ctime,typeOfNotis:'team'})
        notification.to = to._id
        notification.from = from._id
        notification.team = team._id
        notification.apply = true
        to.notifications.push(notification._id)
        await to.save()
        from.notifications.push(notification._id)
        await from.save()
        team.notifications.push(notification._id)
        await team.save()
        await  notification.save()
        res.json({'message':`Applied succesfully `})
        sendMail(`${from.name} has applid for a position in your ${team.teamName} team`,`${to.email}`,`${to.name}`,`About You Team`)
     }
      catch (error) {
        res.json({'error':error.message})
     }
})


notisOfTeamRoutes.get('/kheloNITH/notification/team/reject/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const notification = await Notifications.findById(id).populate('from team')
        const to = await User.findById(notification.to._id)
        const from = await User.findById(notification.from._id)
        notification.reject = true
        notification.apply = false
        notification.accept = false
        notification.toNumber = ''
        notification.fromNumber = ''
        await notification.save()
        await from.save()
        res.json({'message':`You have rejected to ${notification.from.name} `})   
        sendMail(`${to.name} has rejected your appliction for a position in ${notification.team.teamName} team`,
        `${from.email}`,
        `${from.name}`
        ,'About position in team')
 
    } 
    catch (error) {
        res.json({'error':error.message})
    }
})

notisOfTeamRoutes.get('/kheloNITH/notification/team/accept/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const notification = await Notifications.findById(id).populate('from team')
        const to = await User.findById(notification.to._id)
        const from = await User.findById(notification.from._id)
        notification.accept = true
        notification.apply = false
        notification.toNumber = to.number
        notification.fromNumber = from.number
        await notification.save()
        await from.save()
        res.json({'message':`You have Accept the request for a position from ${notification.from.name} `})    
        sendMail(`${to.name} has accepted your application for a position in ${notification.team.teamName} team`,
        `${from.email}`,
        `${from.name}`,
        'About your position in team')

    } 
    catch (error) {
        res.json({'error':error.message})
    }
})


notisOfTeamRoutes.get('/kheloNITH/notification/team/cancel/:id',async(req,res)=>{
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

        res.json({'message':'cancelled the application for position in team, succesfully'})
    } 
    catch (error) {
        res.json({'error':error.message}) 
    }
})

export default notisOfTeamRoutes