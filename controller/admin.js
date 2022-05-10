const Product = require('../models/product');
exports.getProducts =(req,res,next)=>{
    Product.fetchAll()
        .then((products)=>{
            res.render('admin/products',{
                            products,
                            pageTitle:"Admin Products",
                            path:"/admin/products"
                        }
                      );
        })
        .catch((err)=>console.log(err));
}

exports.getAddProduct=(req,res,next)=>{
    res.render("admin/add-product",{
            pageTitle:"Admin Add Product",
            path:"/admin/add-product"
        })
}
exports.postAddProduct=(req,res,next)=>{
    const {title,price,image,description} = req.body;
    const product = new Product(title,price,image,description);
    product.save()
           .then((d)=>{
                res.redirect('/admin/products');
           })
           .catch((err)=>console.log(err));
}