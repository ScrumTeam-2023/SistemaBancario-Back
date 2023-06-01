`use Strict`

const express = require(`express`)
const api = express.Router();
const UserController = require('./user.controller');
const { ensureAuth , isAdmin } = require('../services/autheticathed')
//Rutas Publicas
api.get('/getUsers',UserController.getUsers)
api.get('/getOne/:id',UserController.getOneUser)
api.delete('/delete/:id',UserController.delete)
api.post('/login',UserController.login)
//
//                                      |
// THIS SON OF A $%#@!H GIVE ME ANXIETY V
api.put('/EditUser',UserController.EditUser)
//Rutas Exclusivas
api.post('/save',UserController.save)
//[ensureAuth, isAdmin] Not use for now
module.exports = api