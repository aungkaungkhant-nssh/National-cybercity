const Shop = require('../models/shop');
exports.getProducts =(req,res,next)=>{
    Shop.fetchAll()
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