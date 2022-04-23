// const dotenv = require("dotenv");
const nodemailer = require("nodemailer");


// dotenv.config({ path: "../config/config.env" });

var transporter = nodemailer.createTransport({
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

exports.sendMail = async (req, res, next) => {
    
  console.log(process.env.SENDGRID_API_KEY)
  
   
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



exports.sendConfirmationMail = async (mailId, userId,  next) => {
    
  // console.log(process.env.SENDGRID_API_KEY)
  
  transporter.sendMail({
    from: "mail.onlined@gmail.com", // verified sender email
    to: mailId, // recipient email
    subject: "Verify Email for OnlinEd", // Subject line
    // text: `Welcome to OnlinEd!! Click on below link to veriify: `, // plain text body
    html: `<html>
            <body> 
            <h5> Welcome to OnlinEd!!</h5> 
            <p>
              </a> click <a href="${process.env.BASE_URL}/verify/${userId}"> here </a>  
            </p>
            <p> Copy Paste the below link into the browser, if it doesn't work. <br> Verification Link: http://${process.env.BASE_URL}/verify/${userId} </p>
            </body>
          </html>`,
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
   
};
