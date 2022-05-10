const express = require("express");
const app = express();
const bodyParser= require("body-parser");
const path = require('path')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');

app.use('/',(req,res)=>{
    res.render("shop/index");
})
app.set('views','views');
app.use((req,res,next)=>{
    res.render("404")
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})