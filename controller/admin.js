const Product = require('../models/product');
const {validationResult} = require('express-validator');
const mongoose = require("mongoose")
exports.getProducts =(req,res,next)=>{
    Product.find({userId:req.user._id})
        .then((products)=>{
            res.render('admin/products',{
                            products,
                            pageTitle:"Admin Products",
                            path:"/admin/products",
                        }
                      );
        })
        .catch((err)=>{
                const errors = new Error(err); /// error handling middleware
                errors.httpStatusCode = 500;
                return next(err);
        });
}

exports.getAddProduct=(req,res,next)=>{
    return res.render("admin/add-product",{
            pageTitle:"Admin Add Product",
            path:"/admin/add-product",
            isEditing:false,
            hasError:false,
            oldInput:{},
            validationErrors:[],
            errorMessage:"",
        })
}
exports.postAddProduct=(req,res,next)=>{
    const {title,price,image,description} = req.body;
    const product = new Product({_id:new mongoose.Types.ObjectId("627e1fbdcc28ea1465b2937c"),title,price,image,description,userId:req.user});
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render("admin/add-product",{
                pageTitle:"Admin Add Product",
                path:"/admin/add-product",
                isEditing:false,
                hasError:true,
                oldInput:{title,price,image,description},
                validationErrors:errors.array(),
                errorMessage:errors.array()[0].msg,
        })
    }
    product.save()
           .then((d)=>{
                res.redirect('/admin/products');
           })
           .catch((err)=> {
               const errors = new Error(err); /// error handling middleware
               errors.httpStatusCode = 500;
               return next(err);
           });
}
exports.postDeleteProduct = (req,res,next)=>{
    const {id} = req.body;
    Product.findOneAndDelete({$and:[{_id:id},{userId:req.user._id}]})
        .then(()=>res.redirect('/admin/products'))
        .catch((err)=>{
            const errors = new Error(err); /// error handling middleware
            errors.httpStatusCode = 500;
            return next(err);
        })
}

exports.getEditProduct=(req,res,next)=>{
    const {id} = req.params;
    const isEditing = req.query.edit;
    if(!isEditing){
       return res.redirect("/");
    }
    Product.findOne({$and:[{_id:id},{userId:req.user._id}]})
            .then((product)=>{
                if(!product) return res.redirect('/admin/products')
                res.render("admin/add-product",{
                    pageTitle:"Admin Edit Product",
                    path:'',
                    product,
                    isEditing,
                    hasError:false,
                    oldInput:{},
                    validationErrors:[],
                    errorMessage:"",
                 
                });
            })
            .catch(err => {
                const errors = new Error(err); /// error handling middleware
                errors.httpStatusCode = 500;
                return next(err);
            })
  
}
exports.postEditProduct = (req,res,next)=>{
    const {id,title,image,price,description} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('admin/add-product',{
            pageTitle:"Admin Edit Product",
            path:'',
            isEditing:false,
            oldInput:{id,title,image,price,description},
            validationErrors:errors.array(),
            errorMessage:errors.array()[0].msg,
        })
    }
    Product.findOneAndUpdate({$and:[{_id:id},{userId:req.user._id}]},{title,image,price,description})
        .then((updateProduct)=>{
            res.redirect('/admin/products')
        })
        .catch(err => {
            const errors = new Error(err); /// error handling middleware
            errors.httpStatusCode = 500;
            return next(err);
        })
}