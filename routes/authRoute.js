const express = require('express');
const router = express.Router();
const auth = require('../controller/auth');

router.get('/login',auth.getLogin);
router.post('/login',auth.postLogin);
router.post('/logout',auth.postLogout);

router.get('/signup',auth.getSignUp);
router.post('/signup',auth.postSignUp);
module.exports = router;