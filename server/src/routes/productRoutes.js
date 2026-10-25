const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Rota pública para listar produtos
router.get('/', getProducts);

// Rotas protegidas (Apenas Admin)
router.post('/', verifyToken, verifyAdmin, createProduct);
router.put('/:id', verifyToken, verifyAdmin, updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);

module.exports = router;