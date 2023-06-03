'use strict'

const express = require('express');
const api = express.Router();
const servicesController = require('./services.controller');

api.get('/get', servicesController.getServices);
api.get('/getBy/:id', servicesController.getServiceBy);
api.post('/add', servicesController.createService);
api.put('/update/:id', servicesController.updateService);
api.delete('/delete/:id', servicesController.deleteService);

module.exports = api;