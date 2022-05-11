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
    getCart(){
        const db = getDB();
        
        const productId = [...this.carts.items].map((c)=>c.productId); 

       return db.collection("products")
            .find({_id:{$in:productId}})
            .toArray()
            .then((products)=>{
                return products.map((p)=>{
                    return{
                        ...p,
                        quantity:this.carts.items.find((c)=> c.productId.toString()=== p._id.toString()).quantity
                    }
                })
            })
            .catch((err)=>console.log(err))

    }
    deleteCart(id){
        const updateCart= this.carts.items.filter((c)=>c.productId.toString()!==id);
        const db =getDB();
        return db.collection("users")
                .updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{carts:{items:updateCart}}})
                .then((data)=> data)
                .catch((err)=>console.log(err));
    }
    addOrder(){
        const db = getDB();
       return this.getCart()
            .then((cart)=>{
                const order = {
                   items:cart,
                   user:{
                       _id:new mongodb.ObjectId(this._id),
                       name:this.name
                   }
                }
                return db.collection("orders")
                        .insertOne(order)
            })
            .then((res)=>{
                this.carts={items:[]}
                    db.collection("users")
                  .updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{carts:{items:[]}}})
            })
            .catch((err)=>console.log(err))
       

    }
    getOrder(){
        const db = getDB();
      
        return db.collection("orders")
                 .find({'user._id':this._id})
                 .toArray()
                 .then((orders)=> orders)
                 .catch((err)=>console.log(err));
    }
}