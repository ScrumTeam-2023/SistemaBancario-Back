'use strict'

const Product = require('./product.model')
const User = require('../user/user.model')

exports.test = async(req, res)=>{
    return res.send({message: 'Test is running'})
}

exports.createProduct = async(req, res)=>{
    try {
        
    let data = req.body;
    let existUser = await User.findOne({_id: data.user})
    if(!existUser){
        return res.status(404).send({message: 'User not found'})
    }
    let product = new Product(data);
    await product.save()
    return res.send({message: 'Reservation saved sucessfully'})
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