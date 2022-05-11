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
exports.postAddCart=(req,res,next)=>{
        const {id}= req.body;
        Product.findById(id)
                .then((product)=>{
                   return req.user.addToCart(product);
                })
                .then((data)=> res.redirect('/cart'))
                .catch((err)=>console.log(err))
}

exports.getProduct=(req,res,next)=>{
    const id= req.params.id;
    Product.findById(id)
            .then((product)=>{
                res.render("shop/product-detail",{
                    product,
                    pageTitle:"Product Detail",
                    path:''
                })
            })
            .catch((err)=>console.log(err))
}
exports.getAddCart=(req,res,next)=>{
    req.user.getCart()
        .then((carts)=>{
            res.render('shop/cart',{
                carts,
                pageTitle:"Cart",
                path:"/cart"
            })
        })
        .catch((err)=>console.log(err));
}
exports.postDeleteCart =(req,res,next)=>{
    const {id} = req.body;
    req.user.deleteCart(id)
        .then((d)=>res.redirect('/cart'))
        .catch((err)=>console.log(err))
}

exports.getAddOrder = (req,res,next)=>{
    req.user.getOrder()
        .then((orders)=>{
            res.render('shop/order',{
                pageTitle:"Order",
                path:'/order',
                orders
            })
        })
}
exports.postAddOrder= (req,res,next)=>{
    req.user.addOrder()
        .then((d)=>res.redirect('/cart'))
        .catch((err)=>console.log(err));
}