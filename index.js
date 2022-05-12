const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const path = require('path');
const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoute');
const User = require('./models/user');
const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');
app.set('views','views');


app.use((req,res,next)=>{
    User.findById("627c7cdba712d260facd0649")
        .then((user)=>{
            req.user = user;
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
mongoose.connect(
    "mongodb+srv://root:root@cluster0.t9jp2.mongodb.net/shop?retryWrites=true&w=majority",
)
.then(()=>{
    User.findOne()
        .then((user)=>{
            if(!user){
                const user = new User({
                    name:"mgmg",
                    email:"mgmg@gmail.com",
                    carts:{
                        items:[]
                    }
                })
                user.save();
            }
            app.listen(3000,()=>{
                console.log("Server is running on port 3000")
            })
        })
        .catch((err)=>console.log(err))
  
   
})
.catch((err)=>console.log(err))

