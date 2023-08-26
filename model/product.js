const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    ProductName:{
        type:String,
        required:true,
        unique:true
    },
    ImageUrl:{
        type:String,
        required:true,
    },
    Price:{
        type:Number,
        require:true,
    },
    Desription:{
        type:String,
    },
    userOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
    }
})

const Product = mongoose.model('Product',ProductSchema);

module.exports = Product;
