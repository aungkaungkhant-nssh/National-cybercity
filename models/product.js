const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
module.exports = class Shop{
    constructor(title,price,image,description,id,user_id){
        this.title=title;
        this.price=Number(price);
        this.image=image;
        this.description=description;
        this._id=id;
        this.user_id=user_id
    }
    save(){
        const db = getDb();
        let dbOp;
        if(this._id){
           const {_id,...updateProduct}=this;
           dbOp = db.collection("products")
              .updateOne({_id:new mongodb.ObjectId(_id)},{$set:updateProduct})
        }else{
           dbOp = db.collection("products")
            .insertOne(this);
        }
        return dbOp.then((result)=>console.log(result)).catch((err)=>console.log(err))
    }
    static fetchAll(){
        const db = getDb();
        return db.collection("products")
            .find() //cursor
            .toArray() //return promise
            .then((data)=>data)
            .catch((err)=>console.log(err))
    }
    static destroy(id){
        const db =getDb();
        return db.collection("products")
                .deleteOne({_id:new mongodb.ObjectId(id)})
                .then(()=> console.log("Delete Product"))
                .catch((err)=> console.log(err))

    }
    static findById(id){
        const db = getDb();
        return db.collection('products')
                .find({_id:new mongodb.ObjectId(id)})
                .next()
                .then((product)=>product)
                .catch((err)=>console.log(err));
    }
}