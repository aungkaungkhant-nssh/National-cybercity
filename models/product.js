const getDb = require('../util/database').getDb;
module.exports = class Shop{
    constructor(title,price,image,description){
        this.title=title;
        this.price=Number(price);
        this.image=image;
        this.description=description;
    }
    save(){
        const db = getDb();
        return db.collection("products")
            .insertOne(this);
    }
    static fetchAll(){
        const db = getDb();
        return db.collection("products")
            .find() //cursor
            .toArray() //return promise
            .then((data)=>data)
            .catch((err)=>console.log(err))
    }
}