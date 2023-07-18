const Deposit = require('./deposit.model');
const User = require('../user/user.model');


/// DEPOSITE

exports.makeDeposit = async (req, res) => {
  try {
    const { noCuenta, amount } = req.body;

    const user = await User.findOne({ AccNo: noCuenta });
    if (!user) {
      return res.status(400).send({ message: 'Cuenta no encontrada. Vuelve a intentarlo' });
    }

    const newSaldo = user.balance + Number(amount);
    const updatedAccount = await User.findByIdAndUpdate(
      user._id,
      { balance: newSaldo },
      { new: true }
    );

    const deposito = new Deposit({
      noCuenta,
      amount,
      date: Date.now(),
      status: 'completo' // Establecer el estado como "completado"
    });

    await deposito.save();

    // Aumentar el movimiento en la cuenta de destino
    const newMovement = user.movements + 1;
    await User.findByIdAndUpdate(
      user._id,
      { movements: newMovement },
      { new: true }
    );

    return res.send({ message: 'Depósito exitoso' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'No se puede completar el depósito' });
  }
};

  // GET MY DEPOSIT
  exports.getDepositsByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Buscar el usuario por su ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
      }
  
      // Obtener los depósitos que coincidan con el número de cuenta del usuario
      const deposits = await Deposit.find({ noCuenta: user.AccNo });
  
      return res.send(deposits);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener los depósitos del usuario' });
    }
  };
  
  //CANCEL DEPOSIT
  exports.cancelDeposit = async (req, res) => {
    try {
      const depositId = req.params.id;
  
      const deposito = await Deposit.findOne({ _id: depositId });
      if (!deposito) {
        return res.status(404).send({ message: 'No se encuentra el número del depósito' });
      }
  
      if (deposito.status === 'cancelado') {
        return res.status(400).send({ message: 'El depósito ya ha sido cancelado previamente' });
      }
  
      const tiempo = Math.floor(deposito.date + (1000 * 60 * 1));
      const user = await User.findOne({ AccNo: deposito.noCuenta });
      if (!user) {
        return res.status(404).send({ message: 'Cuenta no encontrada' });
      }
  
      if (Date.now() <= tiempo) {
        let newSaldo = user.balance - deposito.amount;
        const salUpdate = await User.findOneAndUpdate(
          { _id: user._id },
          { balance: newSaldo, movements: user.movements - 1 }, // Restar 1 al campo movements
          { new: true }
        );
  
        const cancelar = await Deposit.findOneAndUpdate(
          { _id: req.params.id },
          { status: 'cancelado' },
          { new: true }
        );
  
        if (!salUpdate || !cancelar) {
          return res.status(500).send({ message: 'Error al actualizar el saldo o el estado del depósito' });
        }
  
        return res.send({ message: 'El depósito se ha cancelado correctamente' });
      }
  
      return res.send({ message: 'El tiempo de cancelación ha expirado' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ocurrió un error' });
    }
  };
  
  
//GET 
   exports.getAllDeposits = async (req, res) => {
   try {
    // Buscar todos los depósitos
    const deposits = await Deposit.find();

    // Enviar la lista de depósitos como respuesta
    res.status(200).json(deposits);
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  } 
  };

  //deposit Update
  exports.updateDeposit = async (req, res) => {
    try {
      const depositId = req.params.id;
      const newAmount = req.body.amount;
  
      const deposito = await Deposit.findOne({ _id: depositId });
      if (!deposito) {
        return res.status(404).send({ message: 'No se encuentra el número del depósito' });
      }
  
      if (deposito.status === 'cancelado') {
        return res.status(400).send({ message: 'No se puede actualizar un depósito cancelado' });
      }
  
      const tiempo = Math.floor(deposito.date + (1000 * 60 * 1));
  
      if (Date.now() <= tiempo) {
        const difference = newAmount - deposito.amount;
        const updatedDeposit = await Deposit.findOneAndUpdate(
          { _id: depositId },
          { amount: newAmount },
          { new: true }
        );
  
        const user = await User.findOne({ AccNo: deposito.noCuenta });
        if (!user) {
          return res.status(404).send({ message: 'Cuenta no encontrada' });
        }
  
        const newBalance = user.balance + difference;
        const updatedUser = await User.findOneAndUpdate(
          { AccNo: deposito.noCuenta },
          { balance: newBalance },
          { new: true }
        );
  
        return res.send({
          message: 'El depósito se ha actualizado y el saldo de la cuenta beneficiaria se ha actualizado',
          deposit: updatedDeposit,
          user: updatedUser
        });
      }
  
      return res.send({ message: 'El tiempo de actualización ha expirado' });
  
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ocurrió un error' });
    }
  };
  