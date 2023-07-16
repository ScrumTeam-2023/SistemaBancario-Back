'use strict'

const express = require('express');
const api = express.Router();
const { isAdmin, ensureAuth } = require('../services/autheticathed')
const addSController = require('./addS.controller');


api.get('/get', [ensureAuth], addSController.getService);
api.get('/getBy/:id', [ensureAuth], addSController.getServiceBy);
api.post('/add', [ensureAuth, isAdmin], addSController.createService);
api.put('/update/:id', [ensureAuth, isAdmin], addSController.updateService);
api.delete('/delete/:id', [ensureAuth, isAdmin], addSController.deleteService);
api.post('/acquire/:id', [ensureAuth], addSController.adquirirService)

module.exports = api;