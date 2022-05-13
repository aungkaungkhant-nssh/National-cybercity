const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer =require('nodemailer');

const transpoter =nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"aungkaungkhantakk123321@gmail.com",
        pass:"09772304598"
    }
});

exports.getLogin=(req,res,next)=>{
    let message = req.flash("error");
    if(message.length > 0){
        message=message[0];
    }else{
        message=null
    }
    res.render('auth/login',{
        pageTitle:'Login',
        path:'/auth/login',
        errorMessage:message
    });
}
exports.postLogin=(req,res,next)=>{
    const {email,password} = req.body;
    User.findOne({email})
        .then((user)=>{
            if(!user) {
                req.flash("error","Invalid email or password")
                return res.redirect('/login')
            };
            bcrypt.compare(password,user.password)
                .then((doMatch)=>{
                    if(!doMatch) {
                        req.flash("error","Invalid email or password")
                        return res.redirect('/login')
                    };
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save((err)=>{
                        console.log(err)
                        res.redirect('/')
                    })
                })
                .catch((err)=>console.log(err))
         })
         .catch(err => console.log(err))
    
}
exports.postLogout = (req,res,next)=>{
    
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/')
    })
}
exports.getSignUp = (req,res,next)=>{
    let message = req.flash("error");
    if(message.length > 0){
        message=message[0];
    }else{
        message=null
    }
    res.render('auth/signup',{
        pageTitle:"SignUp",
        path:'/signup',
       errorMessage:message
    })
}

exports.postSignUp =(req,res,next)=>{
    const {name ,email, password, confirm_password}  = req.body;
    User.findOne({email})
        .then((userOne)=>{
            if(userOne) {
                req.flash("error","Your Email Address is already exist")
                return res.redirect('/signup')
            };
            bcrypt.hash(password,12)
                .then((hashedPassword)=>{
                    const user = new User({name,email,password:hashedPassword});
                    return  user.save();
                })
                .then(()=>{
                    transpoter.sendMail({
                        from:"aungkaungkhantakk123321@gmail.com",
                        to:email,
                        subject:"Sign Up Succeeded",
                        html:"<h1>You successfully sign up</h1>"
                    })
                    res.redirect('/login')
                })
        })
        .catch((err)=>console.log(err))
}