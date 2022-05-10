const Product = require('../models/product');
exports.getIndex=(req,res,next)=>{
    Product.fetchAll()
        .then((products)=>{
            res.render('shop/index',{
                    products,
                    pageTitle:"Products",
                    path:"/"
                });
        })
        .catch((err)=>console.log(err));  
}

exports.getProducts=(req,res,next)=>{
    Product.fetchAll()
        .then((products)=>{
            res.render('shop/product-lists',{
                    products,
                    pageTitle:"Products",
                    path:"/products"
                });
        })
        .catch((err)=>console.log(err));  
}

