const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
      type:String,
    },
    email: {
        type : String,
        require:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    productArray:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    }],
    message:{
        type:String,
      },
});

const UserModel = mongoose.model('User',userSchema);
module.exports = UserModel;
