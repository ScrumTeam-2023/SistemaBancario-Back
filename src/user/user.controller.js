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
            username: `ADMINB`,
            password: '123',
            DPI: 212345683671011,
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

        let ExistUser = await User.findOne({username: 'ADMINB'})
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


exports.login = async(req,res)=>{
    try{
    
        let data = req.body;
        let credentials = { 
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send(msg)

        let user = await User.findOne({username: data.username});
        
        if(user && await checkPassword(data.password, user.password)) {
            let userLogged = {
                name: user.name,
                username: user.username,
                role: user.role,
                AccNo: user.AccNo
            }
            let token = await createToken(user)
            return res.send({message: 'User logged sucessfully', token, userLogged});
        }
        return res.status(401).send({message: 'Invalid credentials'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error, not logged'});
    }
}

exports.save = async(req,res) =>{
    try {
        let data = req.body;
        let dataUser = await User.findOne({_id: data.user})
        let existUser = await User.findOne({name: data.name})
        let params = {
            password: data.password
        }
        let validate = validateData(params);
        if(validate) return res.status(400).send(validate)
        data.password = await encrypt(data.password)

        let user = new User(data)

        //validate Ingeros
        if(data.ingresos < 100) return res.status(400).send({mgs: 'Sorry This account is Restricted to be Created'})

        if(existUser) return res.status(403).send({mgs: 'Sorry this Name is Already Taken'})
        await user.save();
        return res.status(200).send({msg: `The User has Been Created `,user})
    } catch (err) {
        return res.status(500).send({msg: 'Error at Saving',err})
    }
}

exports.getUsers = async(req,res) =>{
    try {
        let getUsers = await User.find()
        return res.status(200).send({getUsers}) // referenciar en front tambien
    } catch (err) {
        console.error(err)
        return res.status(500).send({msg: 'Whops! Something went wrong trying to get all users!'})
    }
}
//s

exports.getOneUser = async(req,res) =>{
    try {
      
      let userId = req.params.id;
      let findUser = await User.findOne({_id: userId})
      if(!findUser) return res.status(404).send({msg:'Sorry We could not find this user'})

      return res.status(200).send({findUser})
    } catch (err) {
        return res.status(500).send({msg:'Error At get One User',err})  
    }
}

exports.editUser = async(req,res) =>{
    try {
        let userId = req.params.id;
        let token = req.user.sub;
        let data = req.body
      //  if(userId != token) return res.status(500).send({message: "No tienes permiso para realizar esta accion"})
        if(data.password || Object.entries(data).length === 0 || data.DPI) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        let userUpdated = await User.findOneAndUpdate(
            {_id: userId},
            data,
            {new: true} 
        )
        if(!userUpdated) return res.status(404).send({message: 'User not found and not updated'});
        return res.send({userUpdated})
    } catch (err) {
        

        console.error(err)
        return res.status(500).send({ message: "Error At Edit Account" })
    }
}



exports.delete = async(req,res) =>{
    try {
        let idUser = req.params.id;

        let defaultAdmin = await User.findOne({username: 'ADMINB'})
        if(defaultAdmin._id == idUser) return res.status(400).send({msg:'Cannot delete Administrator'});

        let userDeleted = await User.findOneAndDelete({_id: idUser})
        if (!userDeleted) return res.status(404).send({msg:'Sorry We could not find this user nor Deleting it'});

            return res.status(200).send.JSON.stringify({userDeleted});
    } catch (err) {
        return res.status(500).send({msg:'Error At Deleting One User',err})  
    }
}