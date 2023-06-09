'use strict'

const Product = require('./product.model')
const User = require('../user/user.model')

exports.test = async(req, res)=>{
    return res.send({message: 'Test is running'})
}

exports.createProduct = async(req, res)=>{
    try {
        
    let data = req.body;
    let product = new Product(data);
    await product.save()
    return res.send({message: 'Product saved sucessfully'})
    }catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error creating Product !!!'})
    }
}

exports.getProducts = async(req, res)=>{
    try {
        let product = await Product.find().populate();
        return res.send({message: 'Product found: ', product})        
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error getting Products !!!'})
    }
}

exports.getProduct = async(req, res)=>{
    try {
        let productId = req.params.id;
        let product = await Product.findOne({_id: productId}).populate();
        if(!product){
            return res.status(400).send({message: 'Product not found'})
        }
        return res.send({message: 'Product found :', product})        
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error getting Product !!!'})
    }
}

exports.updateProduct = async(req, res)=>{
    try {
        let productId = req.params.id;
        let data = req.body
        let params = {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock
        }
        let updateProduct = await Product.findByIdAndUpdate(
            {_id: productId},
            params,
            {new: true}
        )
        if(!updateProduct){
            return res.status(404).send({message: 'Product not found and not updatting'})
        }
        return res.status(200).send({message: 'Product updated ', updateProduct })
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error updating product !!'})
    }
}
exports.deleteProduct = async(req, res)=>{
    try{
        //Capturar el ID del Servicio
        let productId = req.params.id;
        //Eliminarlo
        let deleteProduct = await Product.deleteOne({_id: productId})
        if(deleteProduct.deleteCount === 0)return res.status(404).send({message: 'Product not found, not deleted'});
        return res.send({message: 'Product deleted'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting product'});
    }
}

exports.compra = async(req, res) =>{
    try {
        let productId = req.params.id;
        let compra = req.body;
        const {sub} = req.user
        let product = await Product.findOne({_id: productId})
        if(!product){
            return res.status(400).send({message: 'Product not found'})
        }
        let user = await User.findOne({_id: sub})
        if(product.stock >= compra.compra){
            product.stock = product.stock - compra.compra;   
        }else{
            res.send({message: 'No hay suficientes productos'})
        }
        if(user.balance >= product.price){
            let pr = product.price * compra.compra
            user.balance = user.balance - pr;
        }else{
            res.send({message: 'No hay suficiente presupuesto'})
        }
        if(product.stock == 0){
            res.send({message: 'AGOTADO!!', product})
        }
        this.updateProduct.stock = product.stock;

        /*const comp = new Compra({
            user: user,
            product: product,
        });
        await comp.save();*/

        user.save();
        product.save();

        res.send({message: 'Se a cambiado el stock y el precio', product, user}) 
    } catch (err) {
        console.log(err)
    }
}
