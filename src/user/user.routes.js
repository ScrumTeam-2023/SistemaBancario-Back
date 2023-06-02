`use Strict`

const express = require(`express`)
const api = express.Router();
const UserController = require('./user.controller');
const { ensureAuth , isAdmin } = require('../services/authenticated')
//Validaciones Base

//Rutas

module.exports = api