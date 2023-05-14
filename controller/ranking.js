
import User from "../models/user/user.js"

const rankingFunction = async()=>{
 
    const allUser = await User.find({})
    let rankingArr = []
    allUser.forEach((user)=>{
        const applied = user.progress.applied
        const accepted = user.progress.acceptByOther
        const request = user.progress.request
        const createdEvent = user.progress.numberOfEvents
        let percentile = 0
        if(applied==0){
            percentile = request
        }
        else{
           if(createdEvent!=0){
               percentile  = (request/createdEvent) + (accepted/applied)
           }
           else{
             percentile = (accepted/applied)
           }
        }

        rankingArr.push({id:user.id,percentile})
    })

    rankingArr.sort((a,b)=> b.percentile-a.percentile)

    // console.log(rankingArr)
    rankingArr.forEach(async(rankings,i)=>{
       
        const findUser = await User.findById(rankings.id)
        findUser.rank = i+1
        await findUser.save()

    })

}

export default rankingFunction