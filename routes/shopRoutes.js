const express = require('express');
const router = express.Router();
const shop = require('../controller/products');

router.get('/',shop.getIndex);
router.get('/products',shop.getProducts);
module.exports = router;