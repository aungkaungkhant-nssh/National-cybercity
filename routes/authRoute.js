const express = require('express');
const router = express.Router();
const auth = require('../controller/auth');
const {check,body} = require('express-validator');
const User = require('../models/user');

router.get('/login',auth.getLogin);
router.post('/login',[
    body("email")
        .isEmail()
        .withMessage("Please Enter a valid email")
        .normalizeEmail(), /// changes lower case eg. AKK@gmail.com -> akk@gmail.com
    body("password")
        .isLength({min:6,max:20})
        .withMessage("Password at least 6 characters ")
        .isAlphanumeric()
        .trim() /// trim white space
],auth.postLogin);
router.post('/logout',auth.postLogout);

router.get('/signup',auth.getSignUp);
router.post('/signup',
            [
                check("email")
                    .isEmail()
                    .withMessage("Please enter valid email") //custom message
                    .normalizeEmail() /// changes lower case eg. AKK@gmail.com -> akk@gmail.com
                    .custom((value,{req})=>{ //custom validation
                        return User.findOne({email:value})
                                .then((userOne)=>{
                                    if(userOne) return Promise.reject("Your Email Address is already exist")
                                })
                    }),

                body(
                    "password",
                    "Please enter a password with only numbers and text at least 6 characters"
                )
                    .isLength({min:6,max:20})
                    .isAlphanumeric()
                    .trim(), /// trim white space
                body(
                    "confirm_password",
                )
                .trim() /// trim white space
                .custom((value,{req})=>{
                    if(value !== req.body.password){
                        throw new Error("Do not match you password");
                    }
                    return true;
                })

                
            ],
            auth.postSignUp);

router.get('/reset',auth.getReset);
router.post('/reset',auth.postReset);
router.get('/reset/:token',auth.getNewPassword);
router.post('/new-password',auth.postNewPassword)
module.exports = router;