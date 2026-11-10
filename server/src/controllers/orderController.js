const Order = require('../models/Order');
const Product = require('../models/Product');

// Criar um novo pedido (Carrinho/Checkout)
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'O pedido precisa ter ao menos um item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const { product: productId, quantity } of items) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
        return res.status(400).json({ message: `Estoque insuficiente para "${product.name}"` });
      }
      totalAmount += product.price * quantity;
      orderItems.push({ product: product._id, quantity });
    }

    // Abate o estoque
    for (const { product, quantity } of orderItems) {
      await Product.findByIdAndUpdate(product, { $inc: { stock: -quantity } });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar pedido', error: error.message });
  }
};

// Listar pedidos do usuário logado ou todos (se for admin)
const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'Admin') {
      orders = await Order.find().populate('user', 'name email').populate('items.product');
    } else {
      orders = await Order.find({ user: req.user.id }).populate('items.product');
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
  }
};

module.exports = { createOrder, getOrders };