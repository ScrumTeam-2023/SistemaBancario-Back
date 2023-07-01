`use Strict`

const express = require(`express`)
const api = express.Router();
const DepositController = require('./deposit.controller')
const { ensureAuth , isAdmin } = require('../services/autheticathed')


api.post('/add',DepositController.makeDeposit);
api.get('/getMyDeposit/:id',[ensureAuth, isAdmin], DepositController.getDepositsByUserId)
api.delete('/cancel/:id', DepositController.cancelDeposit);
api.get('/get',DepositController.getAllDeposits)
api.put('/update/:id',DepositController.updateDeposit)


module.exports = api