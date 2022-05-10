const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; /// mongo db access

let _db;
const mongoConnect = (callback)=>{
    MongoClient.connect(
        'mongodb+srv://root:root@cluster0.t9jp2.mongodb.net/national-cybercity?retryWrites=true&w=majority',
        {useUnifiedTopology:true} // clear warning
    ).then((client)=>{
        console.log("connected");
        _db = client.db();
        callback()
    })
    .catch((err)=>console.log(err));
}

const getDb = ()=>{
    if(_db) return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


