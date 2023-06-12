const Deposit = require('./deposit.model');
const User = require('../user/user.model');
const mongoose = require('mongoose');


//DEPOSIT
exports.makeDeposit = async (req, res) => {
    try {
      const { destinationAccount, amount } = req.body;
  
      // Actualizar el saldo del usuario
      const user = await User.findOneAndUpdate(
        { AccNo: destinationAccount },
        { $inc: { balance: amount } },
        { new: true }
      );
  
      // Crear y guardar el depósito
      const deposit = new Deposit({
        user: user._id, // Asignar el ID del usuario al campo "user"
        destinationAccount: destinationAccount,
        amount: amount,
        status: 'pending',
        date: new Date(), // Agregar la fecha actual
      });
  
      await deposit.save();
  
      // Enviar respuesta exitosa
      res.status(200).json({ message: 'Deposit made successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  };
  
  
  
  //GET LAS FIVE DEPOSITES
  exports.getDepositsByAccount = async (req, res) => {
    try {
      const { accountNumber } = req.params;
  
      console.log('Account Number:', accountNumber);
  
      const deposits = await Deposit.find({ destinationAccount: { $eq: accountNumber } })
        .sort({ createdAt: -1 })
        .limit(5);
  
      console.log('Deposits:', deposits);
  
      res.status(200).json({ deposits });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  };
  

  //CANCEL DEPOSIT
  
  
  exports.cancelDeposit = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Buscar el depósito por su ID
      const deposit = await Deposit.findById(id);
  
      // Verificar si el depósito existe
      if (!deposit) {
        return res.status(404).json({ message: 'Deposit not found' });
      }
  
      // Restar el valor del depósito al saldo del usuario
      const user = await User.findByIdAndUpdate(
        deposit.user.toString(), // Convertir el ID del usuario a string
        { $inc: { balance: -deposit.amount } },
        { new: true }
      );
  
      // Eliminar el depósito
      await Deposit.deleteOne({ _id: id });
  
      // Enviar respuesta exitosa con el balance actualizado
      res.status(200).json({ message: 'Deposit cancelled successfully', balance: user.balance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  };
  