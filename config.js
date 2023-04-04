
import dotenv from "dotenv";
dotenv.config()

const env =  {
    websiteEmail:process.env.WEBSITE_EMAIL,
    websiteEmailPassword:process.env.EMAIL_PASSWORD,
    jwtSecretKey:process.env.JWT_SCERETKEY,
    websiteUrl:process.env.WEBSITE_URL
} 

export default env