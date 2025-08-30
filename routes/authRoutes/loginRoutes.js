import express from 'express'
import { client } from '../../dbConfig.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const router = express.Router()
const db = client.db("myEcommerce")
const userColl = db.collection("user")
router.use(cookieParser())

router.post("/user-login", async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.send({
            status: 0,
            message: "Both Fields are Required"
        })
    }
    else {
        let email = req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (email.match(emailFormat) && req.body.password.match(passwordValidation)) {
            let checkUser = await userColl.findOne({ email })
            if (!checkUser) {
                return res.send({
                    status: 0,
                    message: "Email or Password is Invalid"
                })
            }
            else {
                if(!checkUser.isVarified){
                    return res.send({
                        status: 0,
                        message: "User Not Verfied"
                    })
                }
                else{
                    let hashedPassword = await bcrypt.compareSync(req.body.password, checkUser.password);
                    if (!hashedPassword) {
                        return res.send({
                            status: 0,
                            message: "Email or Password is Invalid"
                        })
                    }
                    else {
                        const token = await jwt.sign({
                            firstName: req.body.firstName,
                            email: checkUser.email
                        }, 'secret', { expiresIn: "1h" })
    
                        res.cookie("token", token, {
                            maxAge: 3600000,
                            httpOnly: true,
                            secure: true
                        })
    
                        return res.send({
                            status: 1,
                            message: "Login Successfully"
                        })
                    }
                }
            }
        }
        else {
            res.send("Something Went Wrong")
        }
    }
})

export default router