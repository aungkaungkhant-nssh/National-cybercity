const getDb = require('../util/database').getDb;
module.exports = class Shop{
    static fetchAll(){
        const db = getDb();
       return db.collection("products")
            .find() //cursor
            .toArray() //return promise
            .then((data)=>data)
            .catch((err)=>console.log(err))
    }
}