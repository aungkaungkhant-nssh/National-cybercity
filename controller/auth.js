const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer =require('nodemailer');
const crypto = require('crypto');
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

exports.getReset = (req,res,next)=>{
    let message = req.flash("error");
    if(message.length > 0){
        message=message[0];
    }else{
        message=null
    }
    res.render('auth/reset',{
        pageTitle:'Reset',
        path:'/auth/reset',
        errorMessage:message
    });
}

exports.postReset = (req,res,next)=>{
        crypto.randomBytes(32,(err,buffer)=>{
            if(err) return res.redirect('/reset');
            const token = buffer.toString("hex");
            User.findOne({email:req.body.email})
            .then((user)=>{
                if(!user){
                    req.flash("error","This email not found");
                    return res.redirect('/reset')
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now()+360000;
                return user.save()
            })
            .then(()=>{
                res.redirect('/');
                transpoter.sendMail({
                    from:"aungkaungkhantakk123321@gmail.com",
                    to:req.body.email,
                    subject:"Password Reset",
                    html:`
                        <p>You requested a password reset</p>
                        <p>Click there <a href="http://localhost:3000/reset/${token}">Link</a></p>
                    `
                })
            })
            .catch((err)=> console.log(err))
        })

}

exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;
    User.findOne({resetToken:token,resetTokenExpiration:{$lt:Date.now()}})
        .then((user)=>{
            if(!user) return res.redirect('/');
            let message = req.flash("error");
            if(message.length > 0){
                message=message[0];
            }else{
                message=null
            }
            res.render('auth/new-password',{
                pageTitle:'New Password',
                path:'',
                errorMessage:message,
                userId:user._id,
                passwordToken:token
            });
        })
        .catch((err)=>console.log(err))
}

exports.postNewPassword = (req,res,next)=>{
    const {userId,password,passwordToken} = req.body;
    User.findOne({
            _id:userId,
            resetToken:passwordToken,
            resetTokenExpiration:{$lt:Date.now()}
    })
    .then((user)=>{
        resetUser = user;
        return bcrypt.hash(password,12)
    })
    .then((hashedPassword)=>{
        resetUser.password=hashedPassword;
        resetUser.resetToken=undefined;
        resetUser.resetTokenExpiration=undefined;
        resetUser.save();
    })
    .then(()=> res.redirect('/login'))
    .catch((err)=>console.log(err))
}