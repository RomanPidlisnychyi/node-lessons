const nodemailer = require('nodemailer');
const path = require('path');

const emails = ['myLuckyhelper@gmail.com', 'best4allbyk@gmail.com'];

require('dotenv').config({ path: path.join(__dirname, '.env') });

const main = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `From Lucky ${process.env.NODEMAILER_USER}`,
    to: emails,
    subject: 'Hello',
    text: 'Hello world my friends',
    html: '<strong>Hello world my friends</strong>',
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

main().catch(console.error);
