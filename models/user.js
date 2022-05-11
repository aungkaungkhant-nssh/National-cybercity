const getDB = require('../util/database').getDb;
const mongodb = require('mongodb');
module.exports = class User{
    constructor (name,email,id,cart){
        this.name=name;
        this.email=email;
        this._id=id;
        this.carts = cart;
    }
    static findById(id){
        const db = getDB();
       return db.collection("users")
            .findOne({_id:new mongodb.ObjectId(id)})
    }
    addToCart(product){
        const db =getDB();
        let cartArray=this.carts?.items?[...this.carts.items]:[];
        let cartProductIndex = cartArray.findIndex((c)=>c.productId.toString()==product._id.toString());
        console.log(cartProductIndex);
        if(cartProductIndex>=0){
            cartArray[cartProductIndex].quantity+=1;
            // updateOne=[...this.carts.items]
        }else{
            cartArray.push({productId:new mongodb.ObjectId(product._id),quantity:1})
        }
        let updateCart = {carts:{items:cartArray}};
       return db.collection("users")
            .updateOne({_id:new mongodb.ObjectId(this._id)},{$set:updateCart})
            .then((res)=>res)
            .catch((err)=>console.log(err));
    }
}