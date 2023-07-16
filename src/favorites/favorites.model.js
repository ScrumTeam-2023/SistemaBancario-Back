const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema({
  apodo: { type: String, required: true },
  noCuenta: { type: String, required: true },
  DPI: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Agrega la referencia al modelo User
});

module.exports = mongoose.model('Favorite', favoriteSchema);
