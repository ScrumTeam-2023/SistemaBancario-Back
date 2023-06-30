'use strict'

const express = require('express')
const api = express.Router()
const {ensureAuth} = require('../Services/autheticathed')
const productController = require('./product.controller')

api.get('/test', productController.test);
api.post('/createProduct', productController.createProduct)
api.get('/getProducts', productController.getProducts)
api.get('/getProduct/:id', productController.getProduct)
api.put('/updatePrduct/:id', productController.updateProduct)
api.delete('/deleteProduct/:id', productController.deleteProduct)
api.post('/compra/:id',ensureAuth, productController.compra)

module.exports = api;    