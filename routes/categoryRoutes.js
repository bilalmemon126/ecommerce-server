import express from 'express';
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';

const router = express.Router()

const db = client.db("myEcommerce")
const coll = db.collection("category")

router.post('/category', async (req, res) => {
    if(!req.body.category){
        return res.send({
            status: 0,
            message: "Category is Required"
        })
    }
    else{
        let category = {
            category: req.body.category
        }
    
        let insert = await coll.insertOne(category)
        if (insert) {
            res.send({
                status: 1,
                message: "inserted successfully"
            })
        }
        else {
            res.send({
                status: 0,
                message: "something went wrong"
            })
        }
    }
})

router.get('/category', async (req, res) => {
    let findCategory = coll.find()
    let response = await findCategory.toArray()
    if(response.length > 0){
        res.send(response)
    }
    else{
        res.send({
            status: 0,
            message: "Category Not Found"
        })
    }
})

router.delete('/category/:id', async (req, res) => {
    let categoryId = new ObjectId(req.params.id)
    let findCategory = await coll.findOne(categoryId)
    if(findCategory){
        let deleteCategory = await coll.deleteOne(findCategory)
        if(deleteCategory){
            res.send({
                status: 1,
                message: "Category Deleted Successfully"
            })
        }
        else{
            res.send({
                status: 0,
                message: "Something Went Wrong"
            })
        }
    }
    else{
        res.send({
            status: 0,
            message: "Category Not Found"
        })
    }
})

router.put('/category/:id', async (req, res) => {
    let categoryId = new ObjectId(req.params.id)
    let findCategory = await coll.findOne(categoryId)
    if(findCategory){
        if(!req.body.category){
            res.send({
                status: 0,
                message: "Category is Required"
            })
        }
        else{
            let category = {
                category: req.body.category
            }
            let updateCategory = await coll.updateOne(
                {_id: categoryId},
                {$set: category},
                {}
            )
            if(updateCategory){
                res.send({
                    status: 1,
                    message: "Category Updated Successfully"
                })
            }
            else{
                res.send({
                    status: 0,
                    message: "Something Went Wrong"
                })
            }
        }
    }
    else{
        res.send({
            status: 0,
            message: "Category Not Found"
        })
    }
})
export default router