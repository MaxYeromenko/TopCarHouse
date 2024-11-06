const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text, html) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'topcarhouse313@gmail.com',
            pass: 'lpznhzzvtbjsuwun'
        }
    });

    await transporter.sendMail({
        from: '"Підтримка" <topcarhouse313@gmail.com>',
        to,
        subject,
        text,
        html,
    });
}
module.exports = sendEmail;