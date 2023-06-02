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
        lowercase:true,
        required: true,
    },
    AccNo: {
        type: Number,
        default:  function() {
            return Math.floor(Math.random()*16)
          },
        unique: true
    },
    location:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
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
        required: true
    },
    movement:{
        type: Number,
        default: 0
    },
    role: {
        type: String,
        required: true,
        uppercase: true
    }



},{versionKey : false})

module.exports = mongoose.model(`User`, userSchema)