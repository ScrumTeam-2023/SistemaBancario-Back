'use Strict'

const express = require(`express`)
const api = express.Router();
const TransferController = require('./transfer.controller')
const { ensureAuth , isAdmin } = require('../services/autheticathed')

api.post('/addTransfer',TransferController.makeTransfer);
api.get('/get/:userId', TransferController.getTransfers);

module.exports = api