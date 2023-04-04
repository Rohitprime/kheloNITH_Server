import { Router } from "express";
import jwt from 'jsonwebtoken'
import Team from "../../models/team/team.js";
import User from "../../models/user/user.js";
import dateAndTime from "../../utils/dateAndTimefun.js";
import sendMail from "../../controller/sendEmail.js";
import env from "../../config.js";
const teamRoutes = Router()

const { cdate, ctime } = dateAndTime()



let flag = []
teamRoutes.post('/kheloNITH/team/createTeam',
    async (req, res, next) => {

        const { emailOfPlayers, notp,name } = req.body
        const team = await Team({ teamName: name })
        flag.length = 0;
        for (let i = 0; i < notp; i++) {

            const player = await User.findOne({ email: emailOfPlayers[i] })
            if (!player) {
                flag[i] = { email: emailOfPlayers[i], i }
            }
            else{     
                    const player = await User.findOne({ email:emailOfPlayers[i] })
                    await team.players.push(player._id)
                    player.inTeams.push(team._id)
                    await player.save() 
            }
        }
         req.body.team = team
        next()

    },
    async (req, res) => {

        const { token, notp,type,team,letApply } = req.body
        try {
            const verifiedUser = jwt.verify(token,env.jwtSecretKey)
            const creater = await User.findOne({ email: verifiedUser.email })

            const presentTeam = await Team.find({numberOfPlayers:notp,teamLeader:creater._id,type,players:team.players})
            if(presentTeam.length>0){
                return res.json({'error':'You have already created a team with the same players '})
            }

            team.numberOfPlayers = notp
            team.teamLeader = creater._id
            team.date = cdate
            team.time = ctime
            team.type=type
            team.letApply=letApply
            if (flag.length > 0) {
                let message = ''
                flag.forEach((e) => {
                    message = message + ` ${e.i + 1}- player ( ${e.email} )`
                })
                res.json({ 'error': message + ' is not registerd. make sure all players are registerd first' })

            }
            else if (flag.length == 0) {
                await team.save()
                creater.createdTeams.push(team._id)
                await creater.save()
                res.json({ 'message': 'team created successfully', team })
                sendMail('there is new team')
            }
        }
        catch (error) {
            res.json({ 'error': error.message })
        }
    })


teamRoutes.post('/kheloNITH/team/deleteTeam', async (req, res) => {

    const { id, token } = req.body
    try {
      const verified = jwt.verify(token,env.jwtSecretKey)
      const creater = await User.findOne({ email: verified.email })
      const team = await Team.findById(id).populate('players')
     
  
      const createdTeams = creater.createdTeams
      const indexOfId = createdTeams.indexOf(id)
      createdTeams.splice(indexOfId, 1)
      await creater.save()
      
      const players = team.players
      let i=0
      const playerLength=players.length
    
     
        for(const player of players){
             i++
          const inTeams = player.inTeams
          const indexOfId = inTeams.indexOf(id)
          inTeams.splice(indexOfId, 1)
          await player.save()
        }
        
       if(i==playerLength){

           const deletedTeam = await Team.findByIdAndDelete(id)
           res.json({ 'message': 'deleted succesfully', deletedTeam })
       } 
    
  
    }
    catch (error) {
      res.json({ 'error': error.message })
    }
  
  
  })
  


 teamRoutes.get('/kheloNITH/team/getTeams',async(req,res)=>{
      
      try {
          const teams = await Team.find({}).populate({path:'teamLeader players',populate:{path:'avtar'}})  
          res.json({teams})
      } 
      catch (error) {
         res.json({'error':error.message})
      }
 })


export default teamRoutes