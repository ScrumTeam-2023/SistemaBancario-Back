'use stric'
const Transfer = require('./transfer.model')
const User = require('../user/user.model')

/// TRANSFER
exports.makeTransfer = async (req, res) => {
  try {
    const user = req.user;
    const sourceAccount = user.AccNo;

    let data = req.body;
    data.date = Date.now();
    data.sourceAccount = sourceAccount;

    // Verificar si la cuenta de origen existe
    let existSourceAccount = await User.findOne({ AccNo: data.sourceAccount });
    if (!existSourceAccount) {
      return res.status(400).send({ message: 'Cuenta de origen no encontrada. Volver a intentar' });
    }

    // Verificar si la cuenta de destino existe
    let existDestinationAccount = await User.findOne({ AccNo: data.destinationAccount });
    if (!existDestinationAccount) {
      return res.status(400).send({ message: 'Cuenta de destino no encontrada. Volver a intentar' });
    }

    // Verificar si el DPI coincide con el usuario actual
    if (existDestinationAccount.DPI !== data.DPI) {
      return res.status(400).send({ message: 'El DPI no coincide con el usuario ' });
    }

    // Verificar si el saldo de la cuenta de origen es suficiente
    if (existSourceAccount.balance < data.amount) {
      return res.status(400).send({ message: 'Saldo insuficiente en la cuenta de origen' });
    }

    // Verificar si el monto no excede Q2000
    const transferAmount = Number(data.amount);
    if (transferAmount > 2000) {
      return res.status(400).send({ message: 'No puede transferir más de Q2000' });
    }

    // Obtener la fecha actual
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Establecer la hora en 00:00:00

    // Obtener la fecha de inicio y fin del día actual
    const startOfDay = currentDate.getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

    // Calcular el total de transferencias del día para la cuenta de origen
    const totalTransfers = await Transfer.aggregate([
      {
        $match: {
          sourceAccount: existSourceAccount.AccNo,
          date: { $gte: startOfDay, $lt: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const currentTotal = totalTransfers.length > 0 ? totalTransfers[0].totalAmount : 0;
    const newTotal = currentTotal + transferAmount;

    // Verificar si se excede el límite de transferencia diaria de 10,000
    if (newTotal > 10000) {
      return res.status(400).send({ message: 'Se ha excedido el límite de transferencia diaria' });
    }

    // Actualizar el saldo de la cuenta de origen y aumentar el campo movements
    let newSourceBalance = existSourceAccount.balance - transferAmount;
    await User.findOneAndUpdate(
      { AccNo: data.sourceAccount },
      { balance: newSourceBalance, $inc: { movements: 1 } }
    );

    // Actualizar el saldo de la cuenta de destino y aumentar el campo movements
    let newDestinationBalance = existDestinationAccount.balance + transferAmount;
    await User.findOneAndUpdate(
      { AccNo: data.destinationAccount },
      { balance: newDestinationBalance, $inc: { movements: 1 } }
    );

    // Crear la transferencia con la fecha
    let transfer = new Transfer(data);
    await transfer.save();

    return res.send({ message: 'Transferencia exitosa' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'No se puede completar la transferencia' });
  }
};




//get TRANSFER

exports.getTransfers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar el usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Obtener las últimas 5 transferencias del usuario
    const transfers = await Transfer.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    return res.status(200).json({ success: true, transfers: transfers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error al obtener las transferencias', error: err });
  }
};


//CANCEL TRANSFER

exports.cancelTransfer = async (req, res) => {
  try {
    const transferId = req.params.id;

    const transferencia = await Transfer.findOne({ _id: transferId });
    if (!transferencia) {
      return res.status(404).send({ message: 'No se encuentra el número de transferencia' });
    }

    const tiempo = Math.floor(transferencia.date + (1000 * 60 * 1));

    const sourceAccount = await User.findOne({ AccNo: transferencia.sourceAccount });
    const destinationAccount = await User.findOne({ AccNo: transferencia.destinationAccount });

    if (!sourceAccount || !destinationAccount) {
      return res.status(404).send({ message: 'Cuenta(s) no encontrada(s)' });
    }

    if (Date.now() <= tiempo) {
      let newSourceBalance = sourceAccount.balance + transferencia.amount;
      let newDestinationBalance = destinationAccount.balance - transferencia.amount;

      await User.findOneAndUpdate({ AccNo: transferencia.sourceAccount }, { balance: newSourceBalance });
      await User.findOneAndUpdate({ AccNo: transferencia.destinationAccount }, { balance: newDestinationBalance });

      return res.send({ message: 'La transferencia se ha cancelado' });
    }

    return res.send({ message: 'El tiempo de cancelación ha expirado' });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Ocurrió un error' });
  }
};


//get by account
  exports.getTransfersByAccount = async (req, res) => {
    try {
      const { accountNumber } = req.params;

      // Buscar las transferencias donde la cuenta de origen o destino coincida con el número de cuenta proporcionado
      const transfers = await Transfer.find({
        $or: [{ sourceAccount: accountNumber }, { destinationAccount: accountNumber }]
      });

      res.send(transfers);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener las transferencias' });
    }
  };

  