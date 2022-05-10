const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const path = require('path');
const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoute');
const mongoConnect = require('./util/database').mongoConnect;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');
app.set('views','views');



app.use('/',shopRoutes);
app.use('/admin',adminRoutes);
app.use((req,res,next)=>{
    res.render("404");
})

mongoConnect(()=>{
    app.listen(3000)
})

