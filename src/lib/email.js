const { getConfig } = require('./config');
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, body) => {
    const config = getConfig();
    //email sending
    return false;
}

module.exports = { sendEmail };