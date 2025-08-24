import express from 'express';
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';
import { upload } from '../config/multer.js';

const router = express.Router()

const db = client.db("myEcommerce")
const coll = db.collection("products")

router.post('/product', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 8 }
]), async (req, res) => {
    let products = {
        mainImage: req.files.mainImage,
        images: req.files.images,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        quantity: req.body.quantity,
        gender: req.body.gender
    }
    console.log(products)

    let insert = await coll.insertOne(products)
    if (insert) {
        res.send("inserted successfully")
    }
    else {
        res.send("something went wrong")
    }
})

router.get('/product', async (req, res) => {
    let findProducts = coll.find()
    let response = await findProducts.toArray()
    if(response.length > 0){
        res.send(response)
    }
    else{
        res.send("Products Not Found")
    }
})

router.delete('/product/:id', async (req, res) => {
    let productId = new ObjectId(req.params.id)
    let findProducts = await coll.findOne(productId)
    if(findProducts){
        console.log(findProducts)
        let deleteProduct = await coll.deleteOne(findProducts)
        if(deleteProduct){
            res.send("Product Deleted Successfully")
        }
        else{
            res.send("Something Went Wrong")
        }
    }
    else{
        res.send("Product Not Found")
    }
})

router.put('/product/:id', async (req, res) => {
    let productId = new ObjectId(req.params.id)
    let findProducts = await coll.findOne(productId)
    if(findProducts){
        let products = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        }
        let updateProduct = await coll.updateOne(
            {_id: productId},
            {$set: products},
            {}
        )
        if(updateProduct){
            res.send("Product Updated Successfully")
        }
        else{
            res.send("Something Went Wrong")
        }
    }
    else{
        res.send("Product Not Found")
    }
})
export default router