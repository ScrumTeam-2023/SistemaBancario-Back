'use strict'

const User = require('./user.model');
const Transfer = require('../transfer/transfer.model')
const Deposit = require('../deposit/deposit.model')
const Purchase = require('../purchase/purchase.model')
const Compra = require('../compras/compra.model')
const { validateData, encrypt , checkPassword } = require('../utils/validate')
const { createToken } = require ('../services/jwt')
const jwt = require('jsonwebtoken');



//no sirve por el momento
exports.defaultAdmin = async()=>{
    try {
        let data = {
            name: 'Narrow Future',
            surname: 'For us',
            username: `ADMINB`,
            password: 'ADMINB',
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
                surname: user.surname,
                username: user.username,
                role: user.role,
                AccNo: user.AccNo,
                phone: user.phone,
                email: user.email
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
        let getUsers = await User.find({role: 'CLIENT'})
        return res.status(200).send({getUsers}) // referenciar en front tambien
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({msg: 'Whops! Something went wrong trying to get all users!'})
    }
}


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

exports.getProfile =async(req,res)=> {
    try {
let userToken = req.user                                        //ocultar cualquier dato 1 mostrar / 0 No mostrar
        let findToken = await User.findOne({_id: userToken.sub},{password: 0})
        if(!findToken) return res.status(404).send({message: 'Profile not found'})
        return res.send({findToken})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error Trying to get The profile'})
        
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
        return res.send({message:'User Updated!',userUpdated})
        //usar message
    } catch (err) {
        

        console.error(err)
        return res.status(500).send({ message: "Error At Edit Account" })
    }
}


exports.editProfile = async(req,res) =>{
    try {
        let userId = req.params.id;
        let token = req.user.sub;
        let data = req.body
        if(data.password || data.DPI || Object.entries(data).length === 0) return res.status(400).send({ message: "Some fields cannot be sign"})
        let userUpdated = await User.findOneAndUpdate(
            {_id: token},
            data,{new:true}
        )
        if(!userUpdated) return res.status(404).send({ message: "User not found Nor updated"})
        return res.send({userUpdated})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: "Error At Edit Profile"})
        
    }
}


exports.delete = async(req,res) =>{
    try {
        let idUser = req.params.id;

        let defaultAdmin = await User.findOne({username: 'ADMINB'})
        if(defaultAdmin._id == idUser) return res.status(400).send({msg:'Cannot delete Administrator'});

        let userDeleted = await User.findOneAndDelete({_id: idUser})
        if (!userDeleted) return res.status(404).send({msg:'Sorry We could not find this user nor Deleting it'});

            return res.status(200).send({userDeleted});
    } catch (err) {
        return res.status(500).send({msg:'Error At Deleting One User',err})  
    }
}

///HISTORY

//History

exports.getTransactionsByUserId = async (req, res) => {
    try {
      const token = req.headers.authorization.replace(/['"]+/g, '');
      const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
  
      const userId = decodedToken.sub;
  
      // Verificar si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).send({ message: 'Usuario no encontrado' });
      }
  
      // Obtener todas las transferencias, depósitos, compras y adquisiciones asociadas a la cuenta del usuario
      const transactions = await Promise.all([
        Transfer.find({ $or: [{ sourceAccount: user.AccNo }, { destinationAccount: user.AccNo }] }),
        Deposit.find({ noCuenta: user.AccNo }),
        Purchase.find({ userName: user.username }),
        Compra.find({ user: user._id }).populate('product')
      ]);
  
      const transfers = transactions[0];
      const deposits = transactions[1];
      const purchases = transactions[2];
      const compras = transactions[3];
  
      return res.send({ transfers, deposits, purchases, compras });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error al obtener el historial de transacciones' });
    }
  };
  

//last five movements 
exports.getLastFiveTransactionsByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Verificar si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).send({ message: 'Usuario no encontrado' });
      }
  
      // Obtener todas las transacciones de todas las categorías
      const transfers = await Transfer.find({ $or: [{ sourceAccount: user.AccNo }, { destinationAccount: user.AccNo }] })
        .sort({ date: -1 })
        .select('date amount')
        .lean();
  
      const deposits = await Deposit.find({ noCuenta: user.AccNo })
        .sort({ date: -1 })
        .select('date amount')
        .lean();
  
      const purchases = await Purchase.find({ userName: user.username })
        .sort({ date: -1 })
        .select('date amount')
        .lean();
  
      const compras = await Compra.find({ user: userId })
        .sort({ date: -1 })
        .populate('product')
        .select('date amount')
        .lean();
  
      // Agregar tipo de movimiento a cada objeto
      const transfersWithType = transfers.map((transfer) => ({ ...transfer, type: 'Transfer' }));
      const depositsWithType = deposits.map((deposit) => ({ ...deposit, type: 'Deposit' }));
      const purchasesWithType = purchases.map((purchase) => ({ ...purchase, type: 'Purchase' }));
      const comprasWithType = compras.map((compra) => ({ ...compra, type: 'Compra' }));
  
      // Combinar todas las transacciones en un solo array
      const allTransactions = [...transfersWithType, ...depositsWithType, ...purchasesWithType, ...comprasWithType];
  
      // Ordenar el array de transacciones por fecha de forma descendente
      allTransactions.sort((a, b) => b.date - a.date);
  
      // Obtener las últimas transacciones
      const lastFiveTransactions = allTransactions.slice(0, 5);
  
      return res.send({ transactions: lastFiveTransactions });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error al obtener las últimas transacciones' });
    }
  };
  
  
//getMOVEMENTS ASCEND DESCEND
exports.getUsersByMovements = async (req, res) => {
    try {
      const users = await User.find().sort({ movements: -1 });
      const usersWithCounter = users.map((user) => ({
        ...user._doc,
        "contador de movimientos": user.movements,
      }));
      res.json(usersWithCounter);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  };
  
  