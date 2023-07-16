'use Strict'

const express = require(`express`)
const api = express.Router();
const TransferController = require('./transfer.controller')
const { ensureAuth , isAdmin } = require('../services/autheticathed')

api.post('/addTransfer',ensureAuth,TransferController.makeTransfer);
api.get('/get/:userId', TransferController.getTransfers);
api.delete('/cancel/:id', TransferController.cancelTransfer);
api.get('/getByAccount')

module.exports = api