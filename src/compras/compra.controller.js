'use strict'

const Compra = require('./compra.model')
const User = require('../user/user.model')
const Product = require('../product/product.model')
const controlProd = require('../product/product.controller')
const controlUser = require('../user/user.controller')
exports.test = async(req, res)=>{
    return res.send({message: 'Test is running '})
}

exports.compra = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    const userId = req.user.sub;

    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).send({ message: 'Product not found' });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    if (product.stock < data.cantidad) {
      return res.send({ message: 'No hay suficientes productos' });
    }

    const totalPrice = product.price * data.cantidad;
    if (user.balance < totalPrice) {
      return res.send({ message: 'No hay suficiente presupuesto' });
    }

    // Actualizar stock del producto y balance del usuario
    product.stock -= data.cantidad;
    user.balance -= totalPrice;

    // Actualizar el contador de movimientos del usuario
    user.movements += 1;
    await user.save();

    // Guardar los cambios en el producto
    await product.save();

    // Crear la compra
    const compra = new Compra({
      user: user._id,
      product: product._id,
      productName: product.name,
      cantidad: data.cantidad,
      amount: totalPrice,
      date: new Date()
    });
    await compra.save();

    res.send({
      message: 'Compra realizada con éxito',
      purchaseData: {
        serviceId: product._id,
        serviceName: product.name,
        servicePrice: product.price,
        userName: user.name,
        userBalance: user.balance,
        date: compra.date
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error en la compra' });
  }
};


exports.getCompras = async(req, res) =>{
    try {
        let compra = await Compra.find().populate();
        return res.send({message: 'Compras Found: ', compra})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error al encontrar compras'})
    }
}

/*exports.getCompra = async(req, res) =>{
    try {
        let {sub} = req.user 
        let compra = await Compra.find().populate();
        if(sub == Compra.user){
            return compra
        }
        return res.send({compra})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error al encontrar compras'})
    }
}*/
