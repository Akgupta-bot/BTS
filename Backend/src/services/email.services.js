const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:process.env.EMAIL_USER,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN,
        
    },
    
});



transporter.verify((error,success)=>{
    if(error){
        console.error("Error connecting to email server:",error)
    }else{
        console.error("Email server is ready to send messages")
    }
});
const sendEmail = async (to, subject, text,html) => {
 try{
    const info = await transporter.sendMail({
        from:`"BTS"<${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
     });
     console.log('Message sent:%s',info.messageId);
     console.log('preview URL:%s',nodemailer.getTestMessageUrl(info));
 }catch(error){
    console.error('Error sending email:',error);
 }
}

async function sendRegisterationEmail(userEmail,name){
    const subject ="Welcome to BTS"
    const text =`Hello${name},\n\nThank you for registering at BTS. We're excited to have you on board!\n\n Best regards,\nThe BTS Team `;
    const html=`<p>Hello ${name},</p><p>Thank you for registering at BTS. We're excited to have you on board!</p><p>Best regards,</p><p>The BTS Team</P>`
    await sendEmail(userEmail,subject,text,html);
}

module.exports={sendRegisterationEmail};

