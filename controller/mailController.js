const dotenv = require("dotenv");
const nodemailer = require("nodemailer");


dotenv.config({ path: "../config/config.env" });


exports.sendMail = async (req, res, next) => {
    
  console.log(process.env.SENDGRID_API_KEY)
  
  let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail({
    from: "mail.onlined@gmail.com", // verified sender email
    to: req.params.mailId, // recipient email
    subject: "Test message subject", // Subject line
    text: "Hello world!", // plain text body
    html: "<b>Hello world!</b>", // html body
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.status(200).json({
    status: "success",
  });
};
