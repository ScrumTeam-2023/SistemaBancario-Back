'use strict'

const express = require('express');
const api = express.Router();
const favoriteController = require('./favorites.controller');
const { ensureAuth } = require('../Services/autheticathed')


//Rutas Privadas 
api.get('/favorites',ensureAuth, favoriteController.getFavoritesByUserId);
api.post('/add',ensureAuth, favoriteController.addFavorite)
api.put('/update/:id', favoriteController.updateFavorite)
api.delete('/delete/:id', favoriteController.deleteFavorite);

module.exports = api;