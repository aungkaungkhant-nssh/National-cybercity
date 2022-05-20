const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = "mongodb+srv://root:root@cluster0.t9jp2.mongodb.net/shop?retryWrites=true&w=majority";
const csrf = require('csurf');
const csrfProtection = csrf();
const flash = require('connect-flash');
const errors = require('./controller/errors');
const multer  = require("multer");
const uuidv4 = require('uuid');

const store =  new MongoDBStore({ // store mongodb sessions database
    uri:MONGODB_URI,
    collection:"sessions"
})
store.on('error',function(error){
    console.log(error)
})

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");
    },
    filename:(req,file,cb)=>{
        cb(null,uuidv4.v4()+file.originalname);
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype==="image/jpg" || file.mimetype==="image/jpeg" || file.mimetype==="image/png"){
        cb(null,true);
    }else{
        cb(null,false)
    }
}

app.use(bodyParser.urlencoded({extended:true}));
app.use(multer({storage:fileStorage,fileFilter}).single("image"));
app.use(express.static(path.join(__dirname,"public")));
app.use("/images",express.static(path.join(__dirname,"images")));
app.set('view engine','ejs');
app.set('views','views');

app.use(session({ // create session
    secret:"national cybercity",
    resave: false,  // all request not store session
    saveUninitialized: false,
    store:store
}))

app.use(csrfProtection); // create csrfprotection
app.use(flash());

app.use((req,res,next)=>{ // get session
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req,res,next)=>{
    if(!req.session.user){
       return next();
    }
    User.findById(req.session.user._id)
        .then((user)=>{
            if(!user){
                throw new Error("User not found")
            }
            req.user = user;
            next()
        })
        .catch((err)=>{
            next(new Error(err))
        })
})

const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoute');
const authRoutes = require('./routes/authRoute');
const User = require('./models/user');
const { CLIENT_RENEG_LIMIT } = require("tls");

app.use(shopRoutes);
app.use('/admin',adminRoutes);
app.use(authRoutes);
app.use('/400',errors.get400);
app.use('/500',errors.get500);
app.use((err,req,res,next)=>{  // error handling middleware for 500
    res.render("500",{
        pageTitle:"500",
        path:""
    })
})

mongoose.connect(
   MONGODB_URI,
)
.then(()=>{
    app.listen(3000,()=>{
        console.log("Server is running on port 3000")
    })
})
.catch((err)=>console.log(err))

