'use strict'
//Dev Routes
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

const userRoutes = require('../src/user/user.routes')

//Entity routes

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

//Rutas Entidades

//servidor

exports.initServer = ()=>{
    app.listen(port, ()=>{
        console.log(`Servidor corriendo en el puerto ${port}`)
    })
}
