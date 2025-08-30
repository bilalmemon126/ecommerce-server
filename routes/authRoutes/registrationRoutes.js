import express from 'express'
import { client } from '../../dbConfig.js'
import bcrypt from 'bcrypt'
import { sendEmail } from '../../config/emailVarification.js'

const router = express.Router()
const db = client.db("myEcommerce")
const userColl = db.collection("user")

router.post("/user-register", async (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.phone) {
        return res.send("Please Fill Out All Fields")
    }
    else {
        let email = req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        const phoneFormat = /^(?=(?:\D*\d){10,14}\D*$)\+?[0-9\s-]+$/;
        if (email.match(emailFormat) && req.body.password.match(passwordValidation) && req.body.phone.match(phoneFormat)) {
            let checkUser = await userColl.findOne({ email })
            if (checkUser) {
                return res.send("Email Already Exist")
            }
            else {
                let hashedPassword = await bcrypt.hashSync(req.body.password, 2)
                let verificationOTP = Math.floor(100000 + Math.random() * 900000)
                const expiryOTP = Date.now() + 60 * 1000;
                let user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: email,
                    password: hashedPassword,
                    phone: req.body.phone,
                    otp: verificationOTP,
                    expiry: expiryOTP,
                    isVarified: false
                }

                let insertUser = await userColl.insertOne(user)
                if (insertUser) {
                    sendEmail(`${email}`, `${verificationOTP}`);
                    console.log("Email sent to:", email, "OTP:", verificationOTP);
                    return res.send("Registered Successfully")
                }
                else {
                    res.send("Something Went Wrong");
                }
            }
        }
        else {
            res.send("Something Went Wrong")
        }
    }
})

export default router