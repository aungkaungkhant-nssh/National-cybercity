const express = require('express');
const router = express.Router();
const admin = require('../controller/admin');
router.get('/products',admin.getProducts);

module.exports=router;