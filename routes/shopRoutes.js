const express = require('express');
const router = express.Router();
const shop = require('../controller/products');
const isAuth = require('../middleware/is-auth');
router.get('/',shop.getIndex);
router.get('/products',shop.getProducts);

router.get('/cart',isAuth,shop.getAddCart);
router.post('/cart',isAuth,shop.postAddCart);
router.post('/delete-cart',isAuth,shop.postDeleteCart);
router.get('/product/:id',shop.getProduct);
router.post('/order',isAuth,shop.postAddOrder);
router.get('/order',isAuth,shop.getAddOrder);
module.exports = router;