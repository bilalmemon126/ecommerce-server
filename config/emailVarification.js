import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

export const sendEmail = async (userEmail, verificationOtp) => {
    const info = await transporter.sendMail({
        from: `Bilal Memon <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Verify Your Email",
        text: verificationOtp,
    })
        .then((info) => {
            console.log("Message sent: %s", info.messageId);
        })
        .catch(console.error);
}