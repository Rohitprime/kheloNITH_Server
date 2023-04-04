
const dateAndTime = () => {
    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISTOffset = 330;   // IST offset UTC +5:30 
    const ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
    const hoursIST = ISTTime.getHours()
    const minutesIST = ISTTime.getMinutes()
    let month = ISTTime.getMonth() + 1
    if (month < 10) { month = '0' + month }
    let day = currentTime.getDate()
    if(day<10){
        day = '0'+day
    }
    const cdate = currentTime.getFullYear() + '-' + month + '-' + day
    const ctime = hoursIST + ':' + minutesIST
  
    return {cdate,ctime}

}

export default dateAndTime