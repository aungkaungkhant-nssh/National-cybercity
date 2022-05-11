const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const path = require('path');
const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoute');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');
app.set('views','views');


app.use((req,res,next)=>{
    User.findById("627b36da11b9e34b4fa1c439")
        .then((user)=>{
            console.log(user.name)
            req.user = new User(user.name,user.email,user._id,user.carts);
            next()
        })
        .catch((err)=>console.log(err))
})

app.use('/',shopRoutes);
app.use('/admin',adminRoutes);
app.use((req,res,next)=>{
    res.render("404",{
        pageTitle:'404 Page',
        path:''
    });
})
mongoConnect(()=>{
    app.listen(3000)
})

