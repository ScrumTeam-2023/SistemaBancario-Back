'use strict'

const express = require('express');
const api = express.Router();
const addSController = require('./addS.controller');

api.get('/get', addSController.getService);
api.get('/getBy/:id', addSController.getServiceBy);
api.post('/add', addSController.createService);
api.put('/update/:id', addSController.updateService);
api.delete('/delete/:id', addSController.deleteService);

module.exports = api;