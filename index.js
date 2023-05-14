import  express  from "express";
var app = express();
import cors from 'cors'
import mongoose from "mongoose";
import userRoutes from "./routes/users/users.js";
import profileRouter from "./routes/profile/profile.js";
import sportEventsRoute from "./routes/sportEvents/sportEvents.js";
import teamRoutes from "./routes/team/team.js";
import specificRoutes from "./routes/specific/specific.js";
import notificationsRoutes from "./routes/notifications/notification.js";
import notisOfTeamRoutes from "./routes/notisOfTeam/notisOfTeam.js";
import allPlayersRoutes from "./routes/allPlayers/allPlayers.js";
import dotenv from 'dotenv'
import rankingFunction from "./controller/ranking.js";
dotenv.config()
import env from "./config.js";


app.use(express.json({limit:'20mb'}))
app.use(cors())



app.use(userRoutes)
app.use(profileRouter)
app.use(sportEventsRoute)
app.use(teamRoutes)
app.use(specificRoutes)
app.use(notificationsRoutes)
app.use(notisOfTeamRoutes)
app.use(allPlayersRoutes)

app.get('/',(req,res)=>{
    res.json({'name':'rohit'})
})


app.get('/greeting',(req,res)=>{
    res.json({'message':'welcome to kheloNITH server'})
})

rankingFunction() 


mongoose.connect(process.env.MONGODB_URL)
.then(
    console.log('Database Connected')
    )
.catch((e)=>{
    console.log('error message :-'+e.messages)
})
    
    app.listen(process.env.PORT,()=>{
        console.log('server is running on port - '+ process.env.PORT)
    })