const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
    //host: 'smtp.ethereal.email',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        // user: 'joaquin.walker32@ethereal.email',
        // pass: 'bYzX53eHnbFJjsWb4t'
        user: 'testnodemailer396@gmail.com',
        pass: 'Qwerty@1'
    }
},
{
  from: 'Nodemailer <testnodemailer396@gmail.com>'
}
);

const mailer = message => {
    transporter.sendMail(message, (err, info)=>{
       if (err) console.log(err);
       console.log("Email sent: ",info);
    })
}

module.exports = mailer