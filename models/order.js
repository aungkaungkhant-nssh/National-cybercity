const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    products:[
        {
            product:{type:Object,required:true},
            quantity:{type:Number,required:true}
        }
    ],
    user:{
        name:{type:String,required:true},
        userid:{type:Schema.Types.ObjectId,required:true}
    }
})

module.exports = mongoose.model("Order",OrderSchema);