const Product = require('../models/Product');

// Get all products (Public)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
};

// Create product (Admin only)
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar produto', error: error.message });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar', error: error.message });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar', error: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };