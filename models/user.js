const mongoose = require('mongoose');
const Schema =mongoose.Schema;


const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    carts:{
        items:[
            {
                productId: {type:Schema.Types.ObjectId,ref:"Product",required:true},
                quantity:{type:Number,required:true}
            }
        ]
    }
})

UserSchema.methods.addToCart = function(product){
    let updateCart=[...this.carts.items]
    let existCartIndex = updateCart.findIndex((c)=>c.productId.toString() === product._id.toString());
    if(existCartIndex>=0){
        updateCart[existCartIndex].quantity +=1; 
    }else{
        updateCart.push({productId:product._id,quantity:1});
    }
    this.carts.items = updateCart;
    return this.save()
}
UserSchema.methods.removeCart = function(id){
   let updateCart= this.carts.items.filter((c)=>c.productId.toString() !== id.toString());
   console.log(updateCart)
   this.carts.items = updateCart;
   return this.save();
}
UserSchema.methods.clearCart = function(){
    this.carts.items =[];
    return this.save()
}
module.exports = mongoose.model("User",UserSchema);