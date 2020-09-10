const nodemailer = require("nodemailer")
require('dotenv/config');
const sendmail = (sendto) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        auth: {
            user: "hostemailaddress",
            pass: process.env.PASS
        }
    })
    let mailoptions = {
        from: "senderemailaddress",
        to: sendto,
        subject: "registration info",
        text: "successfully registered"
    }
    transporter.sendMail(mailoptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`email sent ${info.response}`)
        }
    })
}
module.exports = sendmail