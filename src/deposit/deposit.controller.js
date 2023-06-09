'use stric'
const Deposit = require('./deposit.model')
const User = require('../user/user.model')


/// DEPOSITE
exports.makeDeposit = async (req, res) => {
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

    // Actualizar los balances de las cuentas
    sourceUser.balance -= amount;
    destinationUser.balance = Number(destinationUser.balance) + Number(amount);

    // Guardar el depósito en la base de datos
    const deposit = new Deposit({
      sourceAccount: sourceAccount,
      destinationAccount: destinationAccount,
      amount: amount,
    });
    await deposit.save();

    // Guardar los cambios en la base de datos
    await sourceUser.save();
    await destinationUser.save();

    return res.status(200).json({ success: true, message: 'Depósito realizado con éxito', deposit: deposit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error al hacer el depósito', error: err });
  }
};

  