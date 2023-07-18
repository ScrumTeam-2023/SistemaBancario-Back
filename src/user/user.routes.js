`use Strict`

const express = require(`express`)
const api = express.Router();
const UserController = require('./user.controller');
const { ensureAuth , isAdmin } = require('../services/autheticathed')
//Rutas Publicas
api.get('/getUsers',UserController.getUsers)

api.get('/profile',ensureAuth,UserController.getProfile)

api.get('/getOne/:id',UserController.getOneUser)

api.post('/login',UserController.login)
//
//                                      |
// THIS SON OF A $%#@!H GIVE ME ANXIETY V
api.put('/editUser/:id',ensureAuth,UserController.editUser)
api.put('/editProfile/:id',ensureAuth,UserController.editProfile)
api.get('/history', ensureAuth, UserController.getTransactionsByUserId);
api.get('/masMovements',UserController.getUsersByMovements);
//Rutas Exclusivas
api.post('/save',[ensureAuth, isAdmin],UserController.save)
api.delete('/delete/:id',[ensureAuth, isAdmin],UserController.delete)
api.get('/movements/:id', [ensureAuth, isAdmin], UserController.getLastFiveTransactionsByUserId);

//, Not use for now
module.exports = api