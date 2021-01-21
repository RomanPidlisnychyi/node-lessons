const sgMail = require('@sendgrid/mail');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'soni.box85@gmail.com',
  from: 'myLuckyhelper@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do enywhere, even with Node.js</strong>',
};

const main = async () => {
  const result = await sgMail.send(msg);
  console.log(result);
};

main();
