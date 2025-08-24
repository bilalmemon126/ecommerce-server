import express from 'express'
import { client } from '../../dbConfig.js'
import { sendEmail } from '../../config/emailVarification.js'
import { ObjectId } from 'mongodb'

const router = express.Router()
const db = client.db("myEcommerce")
const userColl = db.collection("user")

router.post("/emailverification/:id", async (req, res) => {
    let userId = new ObjectId(req.params.id)
    let findUser = await userColl.findOne(userId)
    if (!findUser) {
        return res.send("Something Went Wrong")
    }
    else {
        if (!req.body.otp) {
            return res.send("Please Enter Your OTP")
        }
        else {
            if (req.body.otp === findUser.otp) {
                if (Date.now() > findUser.expiry) {
                    // let deleteUser = userColl.deleteOne(userId)
                    let deletedUser = await userColl.deleteOne({_id: userId})
                    if(deletedUser){
                        return res.send("Your OTP Has Expired")
                    }
                }
                else {
                    let updateVerifiedUser = await userColl.updateOne(
                        { _id: userId },
                        { $set: { otp: true, expiry: "", isVarified: true } },
                        {}
                    )
                    if (!updateVerifiedUser) {
                        return res.send("Something Went Wrong")
                    }
                    else {
                        return res.send("Now You Can Login")
                    }
                }
            }
            else {
                return res.send("Invalid OTP")
            }
        }

    }
})

export default router