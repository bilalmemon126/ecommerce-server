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
            res.send({
                status: 1,
                message: "Inserted Successfully"
            })
        }
        else {
            res.send({
                status: 0,
                message: "Something Went Wrong"
            })
        }
    }
    else{
        res.send({
            status: 0,
            message: "Product Not Found"
        })
    }

})

router.get('/order', async (req, res) => {
    let findOrder = orderColl.find()
    let response = await findOrder.toArray()
    if(response.length > 0){
        res.send(response)
    }
    else{
        res.send({
            status: 0,
            message: "Product Not Found"
        })
    }
})

router.delete('/order/:id', async (req, res) => {
    let orderId = new ObjectId(req.params.id)
    let findOrder = await orderColl.findOne(orderId)
    if(findOrder){
        let deleteOrder = await orderColl.deleteOne(findOrder)
        if(deleteOrder){
            res.send({
                status: 1,
                message: "Order Deleted Successfully"
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
            message: "Order Not Found"
        })
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
            res.send({
                status: 1,
                message: "Order Updated Successfully"
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
            message: "Order Not Found"
        })
    }
})
export default router