'use strict'

const User = require('./user.model')
const { validateData, encrypt , checkPassword } = require('../utils/validate')
const { createToken } = require ('../services/jwt')



//no sirve por el momento
exports.defaultAdmin = async()=>{
    try {
        let data = {
            name: 'Narrow Future',
            surname: 'For us',
            username: `ADMINADMIN`,
            location: 'Bank of Center',
            phone: '2012-2938',
            email: 'admin@gmail.com',
            jobSite: 'His House',
            ingresos: 1000 ,
            balance: 420,
            role:'ADMIN'
        }
        
        let params = {      
            password: data.password,
        }

        let validate = validateData(params)
        if(validate) return res.status(400).send(validate)

        let ExistUser = await User.findOne({username: 'admin'})
        if(ExistUser) return console.log('Admin already Engaged')
        data.password = await encrypt(data.password)
        let defAdmin = new User(data)
        await defAdmin.save()
        return console.log(`Admin ${defAdmin} engaged`)

    } catch (err) {
        console.error(err)
        return err
    }

}

exports.register = async(req,res) =>{

}

exports.login = async(req,res) =>{
    
}

exports.save = async(req,res) =>{
    
}

exports.get = async(req,res) =>{
    
}

exports.getOne = async(req,res) =>{
    
}

exports.edit = async(req,res) =>{
    
}

exports.delete = async(req,res) =>{
    
}