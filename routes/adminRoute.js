const express = require('express');
const router = express.Router();
const admin = require('../controller/admin');

router.get('/products',admin.getProducts);
router.get('/add-product',admin.getAddProduct);
router.post('/add-product',admin.postAddProduct);

module.exports=router;