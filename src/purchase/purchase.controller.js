const Purchase = require('./purchase.model');
const User = require('../user/user.model');

exports.getMyPurchases = async (req, res) => {
    try {
      const userId = req.user.sub; // Obtener el ID del usuario logeado desde el token
  
      // Buscar el usuario en la base de datos por su ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      // Buscar las adquisiciones del usuario en la base de datos utilizando su nombre de usuario
      const purchases = await Purchase.find({ userName: user.username });
  
      res.json(purchases);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error retrieving purchases' });
    }
  };
  
  
  
  
  
  
    