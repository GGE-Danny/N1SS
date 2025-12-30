const nodemailer = require('nodemailer');

let transporter;

const getTransporter = async () => {
    if (transporter) return transporter;

    // Create a testing account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    console.log(`[EMAIL INFO] Ethereal account created. User: ${testAccount.user}`);
    return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
    const t = await getTransporter();

    let info = await t.sendMail({
        from: '"Premium Boutique" <noreply@premium-ecommerce.com>',
        to,
        subject,
        html,
    });

    console.log(`[EMAIL SENT] Message ID: ${info.messageId}`);
    console.log(`[VIEW EMAIL] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return info;
};

module.exports = { sendEmail };
