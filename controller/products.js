const Product = require('../models/product');
const Order = require('../models/order');
exports.getIndex=(req,res,next)=>{
    Product.find()
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
    Product.find()
        .then((products)=>{
            console.log(products)
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
    req.user
        .populate("carts.items.productId")
        .then((user)=>{
            res.render('shop/cart',{
                carts:user.carts.items,
                pageTitle:"Cart",
                path:"/cart"
            })
        })
        .catch((err)=>console.log(err));
}
exports.postDeleteCart =(req,res,next)=>{
    const {id} = req.body;
    req.user.removeCart(id)
        .then((d)=>res.redirect('/cart'))
        .catch((err)=>console.log(err))
}

exports.getAddOrder = (req,res,next)=>{
    Order.find({"order.user.userid":req.user._id})
        .then((orders)=>{
            res.render('shop/order',{
                pageTitle:"Order",
                path:'/order',
                orders
            })
        })
}
exports.postAddOrder= (req,res,next)=>{
    req.user
        .populate("carts.items.productId")
        .then((user)=>{
            console.log(user.carts.items)
            let products = user.carts.items.map((i)=>{
                return {product:{...i.productId._doc},quantity:i.quantity}
            })
            let newUser = {
                name:user.name,
                userid:user._id
            }
            const order = new Order({
                products,
                user:newUser
            })
            return order.save();
        })
        .then((order)=> {
            req.user.clearCart();
            res.redirect('/order')
        })
        .catch((err)=>console.log(err))
}