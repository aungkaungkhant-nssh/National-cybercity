const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session)
const MONGODB_URI = "mongodb+srv://root:root@cluster0.t9jp2.mongodb.net/shop?retryWrites=true&w=majority";
const csrf = require('csurf');
const csrfProtection = csrf();
const flash = require('connect-flash');

const store =  new MongoDBStore({ // store mongodb sessions database
    uri:MONGODB_URI,
    collection:"sessions"
})
store.on('error',function(error){
    console.log(error)
})


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
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
app.use((req,res,next)=>{
    if(!req.session.user){
       return next();
    }
    User.findById(req.session.user._id)
        .then((user)=>{
            req.user = user;
            next()
        })
        .catch((err)=>console.log(err))
})
app.use((req,res,next)=>{
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoute');
const authRoutes = require('./routes/authRoute');
const User = require('./models/user');
;
app.use(shopRoutes);
app.use('/admin',adminRoutes);
app.use(authRoutes)
app.use((req,res,next)=>{
    res.render("404",{
        pageTitle:'404 Page',
        path:'',
        isLoggedIn:false
    });
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

