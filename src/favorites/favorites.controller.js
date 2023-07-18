'use strict'

const Favorite = require('./favorites.model');
const User = require('../user/user.model');

exports.addFavorite = async (req, res) => {
  const { apodo, noCuenta, DPI } = req.body;

  try {
    // Obtener el ID del usuario logueado
    const userId = req.user.sub;

    // Verificar si el apodo ya existe
    const existingFavorite = await Favorite.findOne({ apodo });
    if (existingFavorite) {
      return res.status(400).json({ message: 'El apodo ya está en uso' });
    }

    // Verificar si el número de cuenta y el DPI coinciden
    const user = await User.findOne({ AccNo: noCuenta, DPI });
    if (!user) {
      return res.status(400).json({ message: 'El número de cuenta y el DPI no coinciden' });
    }

    // Verificar si el favorito ya está agregado para el usuario
    const userFavorites = await Favorite.find({ user: userId });
    const duplicateFavorite = userFavorites.find(favorite => favorite.noCuenta === noCuenta);
    if (duplicateFavorite) {
      return res.status(400).json({ message: 'El favorito ya está agregado' });
    }

    // Crear el nuevo favorito asignando el ID del usuario
    const newFavorite = new Favorite({
      apodo,
      noCuenta,
      DPI,
      user: userId
    });

    // Guardar el favorito en la base de datos
    await newFavorite.save();

    res.status(201).json({ message: 'Favorito agregado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agregar el favorito' });
  }
};


exports.getFavoritesByUserId = async (req, res) => {
  try {
    const userId = req.user.sub; // Obtener el ID del usuario logeado desde el token

    // Buscar los favoritos asociados al usuario
    const favorites = await Favorite.find({ user: userId });

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los favoritos del usuario' });
  }
};
  
exports.updateFavorite = async(req, res)=>{
    try{
        //obtener el Id del producto
        let favoritetId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        
        //Actualizar
        let updateFavorite = await Favorite.findOneAndUpdate(
            {_id: favoritetId},
            data,
            {new: true}
        )
        if(!updateFavorite) return res.send({message: 'Favorite not found and not updated'});
        return res.send({message: 'Favorite updated:', updateFavorite});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating Favorite'});
    }
}

// Delete Favorite
exports.deleteFavorite = async (req, res) => {
    try {
        //Obtener el id a eliminar
        let favoritetId = req.params.id;
        //Eliminar el usuario
        let favoriteDeleted = await Favorite.findOneAndDelete({ _id: favoritetId });
        if (!favoriteDeleted) return res.send({ message: 'Favorite not found and not deleted' });
        return res.send({ message: `Favorite with username ${favoriteDeleted.apodo} deleted sucessfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}
