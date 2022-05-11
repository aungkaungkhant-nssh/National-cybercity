const express = require('express');
const router = express.Router();
const shop = require('../controller/products');

router.get('/',shop.getIndex);
router.get('/products',shop.getProducts);
router.get('/cart',shop.getAddCart);
router.post('/cart',shop.postAddCart);
router.post('/delete-cart',shop.postDeleteCart);
router.get('/product/:id',shop.getProduct);
router.post('/order',shop.postAddOrder);
router.get('/order',shop.getAddOrder);
module.exports = router;