import express from 'express';
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';

const router = express.Router()

const db = client.db("myEcommerce")
const coll = db.collection("category")

router.post('/category', async (req, res) => {
    let category = {
        category: req.body.category
    }

    let insert = await coll.insertOne(category)
    if (insert) {
        res.send("inserted successfully")
    }
    else {
        res.send("something went wrong")
    }
})

router.get('/category', async (req, res) => {
    let findCategory = coll.find()
    let response = await findCategory.toArray()
    if(response.length > 0){
        res.send(response)
    }
    else{
        res.send("Category Not Found")
    }
})

router.delete('/category/:id', async (req, res) => {
    let categoryId = new ObjectId(req.params.id)
    let findCategory = await coll.findOne(categoryId)
    if(findProducts){
        let deleteCategory = await coll.deleteOne(findCategory)
        if(deleteCategory){
            res.send("Category Deleted Successfully")
        }
        else{
            res.send("Something Went Wrong")
        }
    }
    else{
        res.send("Category Not Found")
    }
})

router.put('/category/:id', async (req, res) => {
    let categoryId = new ObjectId(req.params.id)
    let findCategory = await coll.findOne(categoryId)
    if(findCategory){
        let category = {
            category: req.body.category
        }
        let updateCategory = await coll.updateOne(
            {_id: categoryId},
            {$set: category},
            {}
        )
        if(updateCategory){
            res.send("Category Updated Successfully")
        }
        else{
            res.send("Something Went Wrong")
        }
    }
    else{
        res.send("Category Not Found")
    }
})
export default router