import express from 'express'
import { client } from '../../dbConfig.js'
import { ObjectId } from 'mongodb'

const router = express.Router()
const db = client.db("myEcommerce")
const userColl = db.collection("user")

router.post("/user-forgotpasswordvalidation/:id", async (req, res) => {
    let userId = new ObjectId(req.params.id)
    let findUser = await userColl.findOne(userId)
    if (!findUser) {
        return res.send("Something Went Wrong")
    }
    else {
        if (!req.body.otp || !req.body.password) {
            return res.send("Both Fields are Required")
        }
        else {
            const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
            if(req.body.password.match(passwordValidation)){
                if (req.body.otp === findUser.otp) {
                    if (Date.now() > findUser.expiry) {
                        let updateUser = await userColl.updateOne(
                            {_id: userId},
                            {$set: {otp: "", expiry: ""}},
                            {}
                        )
                        if(updateUser){
                            return res.send("Your OTP Has Expired")
                        }
                    }
                    else {
                        let updateVerifiedUser = await userColl.updateOne(
                            { _id: userId },
                            { $set: {password: req.body.password, otp: true, expiry: "", isVarified: true } },
                            {}
                        )
                        if (!updateVerifiedUser) {
                            return res.send("Something Went Wrong")
                        }
                        else {
                            return res.send("Password Changed Successfully")
                        }
                    }
                }
                else{
                    return res.send("Wrong OTP")
                }   
            }
            else {
                return res.send("Password Should Be Strong")
            }
        }

    }
})

export default router