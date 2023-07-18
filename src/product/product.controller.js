'use strict'

const Product = require('./product.model')
const User = require('../user/user.model')
const Compra = require('../compras/compra.model')

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

exports.getMostPurchasedProducts = async (req, res) => {
    try {
      // Obtener todas las compras
      const purchases = await Compra.find();
  
      // Calcular la cantidad de veces que se ha comprado cada producto
      const productCounts = purchases.reduce((counts, compra) => {
        const productId = compra.product.toString();
        counts[productId] = (counts[productId] || 0) + compra.cantidad;
        return counts;
      }, {});
  
      // Obtener los IDs de los productos ordenados por cantidad de compras (de mayor a menor)
      const sortedProductIds = Object.keys(productCounts).sort(
        (a, b) => productCounts[b] - productCounts[a]
      );
  
      // Obtener los detalles de los productos más comprados
      const mostPurchasedProducts = await Product.find({ _id: { $in: sortedProductIds } });
  
      // Agregar contador de compras al objeto de cada producto
      const data = mostPurchasedProducts.map((product) => ({
        ...product.toObject(),
        contadorCompras: productCounts[product._id.toString()] || 0,
      }));
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los productos más comprados' });
    }
  };
  