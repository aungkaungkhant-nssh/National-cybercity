const express = require('express');
const router = express.Router();
const admin = require('../controller/admin');
const isAuth =require('../middleware/is-auth');

router.use(isAuth);
router.get('/products',admin.getProducts);
router.get('/add-product',admin.getAddProduct);
router.post('/add-product',admin.postAddProduct);
router.post('/delete-product',admin.postDeleteProduct);
router.get('/edit-product/:id',admin.getEditProduct);
router.post('/edit-product',admin.postEditProduct);
module.exports=router;