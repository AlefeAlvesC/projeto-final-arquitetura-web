const Order = require('../models/Order');

// Criar um novo pedido (Carrinho/Checkout)
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    const newOrder = new Order({
      user: req.user.id, // ID vem do token JWT decodificado pelo middleware
      items,
      totalAmount,
      status: 'Pendente'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
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