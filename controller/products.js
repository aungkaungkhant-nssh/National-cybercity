const Product = require('../models/product');
const Order = require('../models/order');
const Item_Per_Page = 2;
exports.getIndex=(req,res,next)=>{
    const page = +req.query.page || 1;
    let totalItem;
    Product.find()
        .countDocuments()
        .then((numProducts)=>{
            totalItem = numProducts;
           return Product.find()
                    .skip((page-1)*Item_Per_Page)
                    .limit(Item_Per_Page)
        })
        .then((products)=>{
            res.render('shop/index',{
                    products,
                    pageTitle:"Products",
                    path:"/",
                    currentPage:page,
                    hasNextPage :page * Item_Per_Page < totalItem,
                    hasPreviousPage : page > 1,
                    nextPage:page+1,
                    previousPage:page-1,
                    lastPage:Math.ceil(totalItem/Item_Per_Page)
                });
        })
        .catch((err)=>{
            const errors = new Error(err); /// error handling middleware
            errors.httpStatusCode = 500;
            return next(err);
        });  
}


exports.getProducts=(req,res,next)=>{
    const page = +req.query.page || 1;
    let totalItem;
    Product.find()
        .countDocuments()
        .then((numProducts)=>{
            totalItem = numProducts;
           return Product.find()
                    .skip((page-1)*Item_Per_Page)
                    .limit(Item_Per_Page)
        })
        .then((products)=>{
            res.render('shop/index',{
                    products,
                    pageTitle:"Products",
                    path:"/products",
                    currentPage:page,
                    hasNextPage :page * Item_Per_Page < totalItem,
                    hasPreviousPage : page > 1,
                    nextPage:page+1,
                    previousPage:page-1,
                    lastPage:Math.ceil(totalItem/Item_Per_Page)
                });
        })
        .catch((err)=>{
            const errors = new Error(err); /// error handling middleware
            errors.httpStatusCode = 500;
            return next(err);
        });  
}
exports.postAddCart=(req,res,next)=>{
        const {id}= req.body;
        Product.findById(id)
                .then((product)=>{
                   return req.user.addToCart(product);
                })
                .then((data)=> res.redirect('/cart'))
                .catch((err)=>{
                        const errors = new Error(err); /// error handling middleware
                        errors.httpStatusCode = 500;
                        return next(err);
                })
}

exports.getProduct=(req,res,next)=>{
    const id= req.params.id;
    Product.findById(id)
            .then((product)=>{
                res.render("shop/product-detail",{
                    product,
                    pageTitle:"Product Detail",
                    path:'',
                })
            })
            .catch((err)=>{
                const errors = new Error(err); /// error handling middleware
                errors.httpStatusCode = 500;
                return next(err);
            })
}
exports.getAddCart=(req,res,next)=>{
    req.user
        .populate("carts.items.productId")
        .then((user)=>{
            res.render('shop/cart',{
                carts:user.carts.items,
                pageTitle:"Cart",
                path:"/cart",
            })
        })
        .catch((err)=>{
            const errors = new Error(err); /// error handling middleware
            errors.httpStatusCode = 500;
            return next(err);
        });
}
exports.postDeleteCart =(req,res,next)=>{
    const {id} = req.body;
    req.user.removeCart(id)
        .then((d)=>res.redirect('/cart'))
        .catch((err)=>{
            const errors = new Error(err); /// error handling middleware
            errors.httpStatusCode = 500;
            return next(err);
        })
}

exports.getAddOrder = (req,res,next)=>{
    Order.find({"user.userid":req.user._id})
        .then((orders)=>{
            res.render('shop/order',{
                pageTitle:"Order",
                path:'/order',
                orders,
            })
        })
        .catch((err)=>{
            return next(new Error(err))
        })
}
exports.postAddOrder= (req,res,next)=>{
    req.user
        .populate("carts.items.productId")
        .then((user)=>{
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
        .catch((err)=>{
            const errors = new Error(err); /// error handling middleware
            errors.httpStatusCode = 500;
            return next(err);
        })
}
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
exports.getInvoice = (req,res,next)=>{
    const orderId = req.params.orderId;
    Order.findById(orderId) 
        .then((order)=>{
            if(!order) return next(new Error("Order not found"))
            if(order.user.userid.toString() !== req.user._id.toString()){
                return next(new Error("Unauthorized"));
            }
            const invoicename = 'invoice-'+orderId+".pdf";
            const invoicepath =  path.join("data","invoices",invoicename);
            const doc = new PDFDocument();
            res.setHeader('Content-Type',"application/pdf");
            res.setHeader("Content-Disposition",`attachment;filename=${invoicename}`);
            doc.pipe(fs.createWriteStream(invoicepath));
            doc.pipe(res);
            doc.fontSize(26).text("Invoice",{
                underline:true
            })
            doc.text("---------------------");
            let totalPrice = 0;
            order.products.forEach((o)=>{
                totalPrice += o.quantity *o.product.price;
                doc.fontSize(14).text(
                        o.product.title
                        + "-" +
                        o.quantity
                        + "*"+"$"+o.product.price);
            });
            doc.text("---------------------");
            doc.fontSize(20).text(`Total Price : $`+ totalPrice);
            doc.end();

            
            // const file = fs.createReadStream(invoicepath);
            // res.setHeader('Content-Type',"application/pdf");
            // res.setHeader("Content-Disposition",`inline;filename=${invoicename}`);
            // file.pipe(res)
          
        })
        .catch((err)=> next(err));

   
}