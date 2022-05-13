const Product = require('../models/product');
exports.getProducts =(req,res,next)=>{
    Product.find()
        .then((products)=>{
            res.render('admin/products',{
                            products,
                            pageTitle:"Admin Products",
                            path:"/admin/products",
                            
                        }
                      );
        })
        .catch((err)=>console.log(err));
}

exports.getAddProduct=(req,res,next)=>{
    res.render("admin/add-product",{
            pageTitle:"Admin Add Product",
            path:"/admin/add-product",
            isEditing:false,
            
        })
}
exports.postAddProduct=(req,res,next)=>{
    const {title,price,image,description} = req.body;
    const product = new Product({title,price,image,description,userId:req.user});
    product.save()
           .then((d)=>{
                res.redirect('/admin/products');
           })
           .catch((err)=>console.log(err));
}
exports.postDeleteProduct = (req,res,next)=>{
    const {id} = req.body;
    Product.findByIdAndRemove(id)
        .then(()=>res.redirect('/admin/products'))
        .catch((err)=>console.log(err))
}

exports.getEditProduct=(req,res,next)=>{
    const {id} = req.params;
    const isEditing = req.query.edit;
    if(!isEditing){
       return res.redirect("/");
    }
    Product.findById(id)
            .then((product)=>{
                res.render("admin/add-product",{
                    pageTitle:"Admin Edit Product",
                    path:'',
                    product,
                    isEditing,
                    
                });
            })
            .catch(err => console.log(err))
  
}
exports.postEditProduct = (req,res,next)=>{
    const {id,title,image,price,description} = req.body;
    Product.findOneAndUpdate({_id:id},{title,image,price,description})
        .then((updateProduct)=>{
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}