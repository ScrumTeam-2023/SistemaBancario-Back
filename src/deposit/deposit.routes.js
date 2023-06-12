`use Strict`

const express = require(`express`)
const api = express.Router();
const DepositController = require('./deposit.controller')
const { ensureAuth , isAdmin } = require('../services/autheticathed')

api.post('/add',DepositController.makeDeposit);
api.get('/getDeposit/:accountNumber', DepositController.getDepositsByAccount)
api.delete('/cancel/:id', DepositController.cancelDeposit);


module.exports = api