'use strict'

const express = require('express')
const api = express.Router()
const {ensureAuth} = require('../Services/autheticathed')
const compraController = require('./compra.controller')

api.get('/test', compraController.test);
api.post('/compra/:id',ensureAuth, compraController.compra)
api.get('/getCompras', compraController.getCompras)
//api.get('/comp', ensureAuth, compraController.getCompra)

module.exports = api;