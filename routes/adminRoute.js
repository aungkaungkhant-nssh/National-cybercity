const express = require('express');
const router = express.Router();
const admin = require('../controller/admin');
const isAuth =require('../middleware/is-auth');
const {check} = require('express-validator');

router.use(isAuth);
router.get('/products',admin.getProducts);
router.get('/add-product',admin.getAddProduct);
router.post('/add-product',[
    check("title")
        .isString()
        .isLength({min:3})
        .trim(),
    check("price")
        .isFloat(),
    // check("image"),
    check("description")
        .isLength({min:5,max:400})
        .trim()
]
,admin.postAddProduct);
router.delete('/product/:id',admin.postDeleteProduct);
router.get('/edit-product/:id',admin.getEditProduct);
router.post('/edit-product',[
    check("title")
        .isString()
        .isLength({min:3})
        .trim(),
    check("price")
        .isFloat(),
    check("image"),
    check("description")
        .isLength({min:5,max:400})
        .trim()
]
,admin.postEditProduct);
module.exports=router;