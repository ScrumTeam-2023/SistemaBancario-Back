'use strict'
//Dev Routes
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

const userRoutes = require('../src/user/user.routes')
const addSRoutes = require('../src/addServices/addS.routes')
const depositeRoutes = require('../src/deposit/deposit.routes')
const tranferRoutes = require('../src/transfer/transfer.routes')
const productRoutes = require('../src/product/product.routes')
//Entity routes

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

//Rutas Entidades
app.use('/user',userRoutes)
app.use('/addServices',addSRoutes)
app.use('/deposit',depositeRoutes)
app.use('/transfer',tranferRoutes)
app.use('/product',productRoutes)
//servidor

exports.initServer = ()=>{
    app.listen(port, ()=>{
        console.log(`Servidor corriendo en el puerto ${port}`)
    })
}
