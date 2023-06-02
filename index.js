'use strict'


require('dotenv').config();

const mongoConfig = require('./config/mongo');
const app = require('./config/app');
const userController = require('./src/user/user.controller')

mongoConfig.connect()
app.initServer();
userController.defaultAdmin();