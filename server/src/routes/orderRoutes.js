const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Todas as rotas de pedidos exigem que o usuário esteja logado
router.use(verifyToken);

router.post('/', createOrder);
router.get('/', getOrders);

module.exports = router;