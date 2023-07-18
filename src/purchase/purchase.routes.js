'use Strict'

const express = require(`express`)
const api = express.Router();
const PurchaseController = require('./purchase.controller')
const { ensureAuth , isAdmin } = require('../services/autheticathed')

api.get('/mypurchases',ensureAuth, PurchaseController.getMyPurchases);

module.exports = api