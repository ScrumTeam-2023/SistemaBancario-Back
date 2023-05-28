'use strict'


require('dotenv').config();

const mongoConfig = require('./config/mongo');
const app = require('./config/app');

mongoConfig.connect()
app.initServer();