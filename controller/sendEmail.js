import nodemailer from "nodemailer";
import { config } from "dotenv";
import Mailgen from "mailgen";

import env from '../config.js'


const sendMail = async (
  emailMessage='some message',
  toEmail='rohitprime0@gamil.com',
  to='Player',
  emailSubject='some subject'
  
  ) => {
  

   
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: env.websiteEmail, // generated ethereal user
      pass: env.websiteEmailPassword, // generated ethereal password
    },
  });


  try {
      
    var mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'kheloNITH',
            link: env.websiteUrl
        }
     })

     var email = {
        body: {
            name: to,
            intro:emailMessage,
            action: {
                instructions: 'To visit kheloNITH website click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'kheloNITH',
                    link: env.websiteUrl
                }
            },
            outro: 'for any suggestion please contact us!'
        }
    };

    var emailBody = mailGenerator.generate(email);


    let message = await transporter.sendMail({
        from: env.websiteEmail, // sender address
        to: toEmail, // list of receivers
        subject:emailSubject,
        html: emailBody, // html body
      });
    
    
  } 
  catch (error) {
    console.log(error.message)
  }

};

export default sendMail
