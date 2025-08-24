import express from 'express';
import { client } from './dbConfig.js';
import productsRoutes from './routes/productsRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import registrationRoutes from './routes/authRoutes/registrationRoutes.js'
import loginRoutes from './routes/authRoutes/loginRoutes.js'
import emailVerificationRoutes from './routes/authRoutes/emailVerificationRoutes.js'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

client.connect()
console.log("connected successfully")


const app = express()
const port = 3000;

app.use(express.json());
app.use(cookieParser())


app.use(registrationRoutes)
app.use(emailVerificationRoutes)
app.use(loginRoutes)

app.use((req, res, next) => {
  try{
    let decoded = jwt.verify(req.cookies.token, "secret")
    console.log(decoded)
    next()
  }
  catch(error){
    return res.send({
      status : 0,
      error : error,
      message : "Invalid Token"
    })
  }
})

app.use(productsRoutes)
app.use(categoryRoutes)
app.use(orderRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
