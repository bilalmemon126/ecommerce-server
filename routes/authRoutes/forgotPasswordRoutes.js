import express from 'express'
import { client } from '../../dbConfig.js'
import { sendEmail } from '../../config/emailVarification.js'

const router = express.Router()
const db = client.db("myEcommerce")
const userColl = db.collection("user")

router.post("/user-forgotpassword", async (req, res) => {
    if (!req.body.email) {
        return res.send({
            status: 0,
            message: "Email is Required"
        })
    }
    else {
        let email = req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if (email.match(emailFormat)) {
            let checkUser = await userColl.findOne({ email })
            if (!checkUser) {
                return res.send({
                    status: 0,
                    message: "Invalid Email"
                })
            }
            else {
                let verificationOTP = Math.floor(100000 + Math.random() * 900000)
                const expiryOTP = Date.now() + 60 * 3000;
                let userVerification = await userColl.updateOne(
                    {_id: checkUser._id},
                    {$set: {otp: verificationOTP, expiry: expiryOTP}},
                    {}
                )
                if(!userVerification){
                    return res.send({
                        status: 0,
                        message: "Something Went Wrong"
                    })
                }
                else{
                    sendEmail(`${email}`, `${verificationOTP}`)
                    return res.send("OTP Send Successfully")
                }
            }
        }
        else {
            res.send("Something Went Wrong")
        }
    }
})

export default router