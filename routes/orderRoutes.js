import express from 'express';
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';

const router = express.Router()

const db = client.db("myEcommerce")
const productColl = db.collection("products")
const orderColl = db.collection("order")

router.post('/order/:id', async (req, res) => {
    let productId = new ObjectId(req.params.id)
    let findProducts = await productColl.findOne(productId)
    if(findProducts){
        let orderedProduct = {
            title: findProducts.title,
            price: findProducts.price,
            status: "pending"
        }
        let insert = await orderColl.insertOne(orderedProduct)
        if (insert) {
            res.send("Inserted Successfully")
        }
        else {
            res.send("Something Went Wrong")
        }
    }
    else{
        res.send("Product Not Found")
    }

})

router.get('/order', async (req, res) => {
    let findOrder = orderColl.find()
    let response = await findOrder.toArray()
    if(response.length > 0){
        res.send(response)
    }
    else{
        res.send("Products Not Found")
    }
})

router.delete('/order/:id', async (req, res) => {
    let orderId = new ObjectId(req.params.id)
    let findOrder = await orderColl.findOne(orderId)
    if(findOrder){
        let deleteOrder = await orderColl.deleteOne(findOrder)
        if(deleteOrder){
            res.send("Order Deleted Successfully")
        }
        else{
            res.send("Something Went Wrong")
        }
    }
    else{
        res.send("Order Not Found")
    }
})

router.put('/order/:id', async (req, res) => {
    let orderId = new ObjectId(req.params.id)
    let findOrder = await orderColl.findOne(orderId)
    if(findOrder){
        let order = {
            status: req.body.status
        }
        let updateOrder = await orderColl.updateOne(
            {_id: orderId},
            {$set: order},
            {}
        )
        if(updateOrder){
            res.send("Order Updated Successfully")
        }
        else{
            res.send("Something Went Wrong")
        }
    }
    else{
        res.send("Order Not Found")
    }
})
export default router