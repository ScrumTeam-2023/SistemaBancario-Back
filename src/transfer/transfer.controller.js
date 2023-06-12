'use stric'
const Transfer = require('./transfer.model')
const User = require('../user/user.model')

/// TRANSFER

exports.makeTransfer = async (req, res) => {
  try {
    const { sourceAccount, destinationAccount, amount } = req.body;

    // Verificar si la cuenta de origen existe
    const sourceUser = await User.findOne({ AccNo: sourceAccount });
    if (!sourceUser) {
      return res.status(404).json({ success: false, message: 'La cuenta de origen no existe' });
    }

    // Verificar si la cuenta de destino existe
    const destinationUser = await User.findOne({ AccNo: destinationAccount });
    if (!destinationUser) {
      return res.status(404).json({ success: false, message: 'La cuenta de destino no existe' });
    }

    // Verificar si el usuario de la cuenta de origen tiene suficiente balance
    if (sourceUser.balance < amount) {
      return res.status(400).json({ success: false, message: 'Saldo insuficiente en la cuenta de origen' });
    }

    // Verificar límite de transferencia diario
    const today = new Date().setHours(0, 0, 0, 0);
    const totalTransfersToday = await Transfer.countDocuments({
      user: sourceUser._id,
      date: { $gte: today },
    });
    const dailyLimit = 10000;
    const remainingLimit = dailyLimit - totalTransfersToday;
    if (amount > remainingLimit) {
      return res.status(400).json({ success: false, message: 'Se ha excedido el límite de transferencia diario' });
    }

    // Actualizar los balances de las cuentas
    sourceUser.balance -= Number(amount);
    destinationUser.balance += Number(amount);

    // Crear la transferencia en la base de datos
    const transfer = new Transfer({
      sourceAccount: sourceAccount,
      destinationAccount: destinationAccount,
      amount: Number(amount),
      user: destinationUser._id,
    });
    await transfer.save();

    // Guardar los cambios en la base de datos
    await sourceUser.save();
    await destinationUser.save();

    return res.status(200).json({ success: true, message: 'Transferencia realizada con éxito', transfer: transfer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error al realizar la transferencia', error: err });
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
