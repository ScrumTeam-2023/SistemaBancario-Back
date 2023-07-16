'use strict'

const Compra = require('./compra.model')
const User = require('../user/user.model')
const Product = require('../product/product.model')
const controlProd = require('../product/product.controller')
const controlUser = require('../user/user.controller')
exports.test = async(req, res)=>{
    return res.send({message: 'Test is running '})
}

exports.compra = async(req, res) =>{
    try {
        let productId = req.params.id;
        let data = req.body;
        const {sub} = req.user
        let product = await Product.findOne({_id: productId})  
        if(!product){
            return res.status(400).send({message: 'Product not found'})
        }
        let user = await User.findOne({_id: sub})
        if(product.stock >= data.cantidad){
            product.stock = product.stock - data.cantidad;   
        }else{
            res.send({message: 'No hay suficientes productos'})
        }
        if(user.balance >= product.price){
            let pr = product.price * data.cantidad
            user.balance = user.balance - pr;
           
        }else{
            res.send({message: 'No hay suficiente presupuesto'})
        }
        if(product.stock == 0){
            res.send({message: 'AGOTADO!!', product})
        }
        if(data.cantidad > 0){
            user.movements = user.movements + 1;
        controlProd.updateProduct.stock = product.stock;
        controlUser.editUser.movements = user.movements;
        const comp = new Compra({
            user: user,
            product: product._id,
            cantidad: data.cantidad
        });
        await comp.save();
        user.save();
        product.save();
        }
        res.send({message: 'Se a cambiado el stock y el precio', product, user}) 
    } catch (err) {
        console.log(err)
    }
}

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
