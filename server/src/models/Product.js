const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'O nome do produto é obrigatório'] },
  description: { type: String, required: true },
  price: { type: Number, required: [true, 'O preço é obrigatório'] },
  category: { type: String, required: true }, // Ex: Action Figures, HQs, Canecas
  stock: { type: Number, required: true, default: 0 },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);