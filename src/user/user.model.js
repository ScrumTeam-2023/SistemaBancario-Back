'use Strict'
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique:true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    AccNo: {
        type: Number,
        default:  function() {
            return Math.floor(Math.random()*1000000000000000)
          },
        unique: true,
        required: false
    },
    location:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    jobSite: {
        type: String,
        required: true,
    },
    ingresos:{
        type: Number,
        required: true,
    },
    balance:{
        type: Number,
        required: false,
        default: 0
    },
    movement:{
        type: Number,
        default: 0
    },
    role: {
        type: String,
        required: false,
        uppercase: true,
        default: 'CLIENT'
    }



},{versionKey : false})

module.exports = mongoose.model(`User`, userSchema)